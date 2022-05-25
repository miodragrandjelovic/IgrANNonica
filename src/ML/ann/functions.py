from gc import callbacks
from unicodedata import category
import pandas as pd
import numpy as np
from sklearn.feature_selection import VarianceThreshold
from sklearn.preprocessing import LabelEncoder, OneHotEncoder, OrdinalEncoder, StandardScaler, scale
from sqlalchemy import column


import tensorflow as tf
import category_encoders as ce


from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.preprocessing import MinMaxScaler
from sklearn.feature_selection import VarianceThreshold

from tensorflow import keras
from keras.models import Sequential
from keras.layers import Dense 
from keras.losses import MeanSquaredError, BinaryCrossentropy, CategoricalCrossentropy

from keras.callbacks import Callback
from keras.utils import np_utils
import keras.backend as K



class initdict():
    global dictionary
    try:
        dictionary
        print("postojim")
    except NameError:
        print("well, it WASN'T defined after all!")
        dictionary=dict()


class epochResults(Callback):
    def on_epoch_end(self, epoch, logs=None):
        listOfLogs = dict()
        listOfLogs["Epoch"] = epoch + 1

        keys = list(logs.keys())
        for key in keys:
            listOfLogs[key] = logs.get(key)

        print("LIST OF LOGS FOR EPOCH ",listOfLogs["Epoch"])
        print(listOfLogs)

    
    def on_batch_end(self, epoch, logs=None):
        print("ITS THE END OF A BATCH")


def load_data(features, label, data ):
    # moze da se prosledi i kao json string
    # data = pd.read_json(url)
    #data = pd.read_csv(url)
    
    features.append(label)
    
    #print("FEATURES TO KEEP")
    #print(features)

    data = data[features]
    data.columns = features

    return data

def feature_and_label(data, label):
    #print("DATA BEFORE LABEL POP")
    #print(data.head())

    y = data.pop(label)
    y.columns = label

    #print("DATA X ISSS")
    #print(data.head())

    #print("DATA y ISSS")
    #print(y.head())
    return data,y

def normalize(df):  #ceo dodat
    global scaler
    sc=MinMaxScaler()
    scaler=sc
    df=scaler.fit_transform(df)
    
    #for (columnName,columnData) in df.iteritems():
    #    df[str(columnName)]=columnData/columnData.max()
    
    return df

    

def split_data(X, y, ratio,val_test, randomize):
    # ratio je npr 20, a nama treba 0.2
    ratio = ratio / 100
    val_test=val_test / 100
    print("Split data usao")
    print(X)
    print(y)
    if(randomize==False):
        (X_train, X_rem, y_train, y_rem) = train_test_split(X, y, test_size = 1-ratio, random_state=5)
        (X_val, X_test, y_val, y_test) = train_test_split(X_rem, y_rem, test_size = 1-val_test, random_state=5)

    else:
        (X_train, X_rem, y_train, y_rem) = train_test_split(X, y, test_size = 1-ratio)
        (X_val, X_test, y_val, y_test) = train_test_split(X_rem, y_rem, test_size = 1-val_test)
    
    print("prosao split")
    return (X_train,X_val, X_test, y_train,y_val, y_test)

def filter_data(data):
    # check for duplicate rows
    #data.drop_duplicates(inplace=True, keep='first')
    
    # first, removing data with constant value
    constant_filter = VarianceThreshold(threshold=0)
    constant_filter.fit(data)
    #constant_list = [column for column in data.columns if column not in data.columns[constant_filter.get_support()]]
    #print("COLUMS THAT ARE CONSTANT ARE ", constant_list)
    data_filter = constant_filter.transform(data)
    # print("After first removal: ", data.shape)

    # now, removing Quasi constants, which are not big influence on data
    quasi_constant_filter = VarianceThreshold(threshold=0.01)
    quasi_constant_filter.fit(data_filter)
    #quasi_constant_list = [column for column in data_filter.columns if column not in data_filter.columns[constant_filter.get_support()]]
    #print("COLUMS THAT ARE QUASI CONSTANT ARE ", quasi_constant_list)
    data_quasi_filter = quasi_constant_filter.transform(data_filter)
    # print("After second removal: ", data_quasi_filter.shape)

    
    """
    # remove duplicates in terms of columns
    X_train_T = X_train_quasi_filter.T
    X_test_T = X_test_quasi_filter.T
    print("Type of data is ", X_train_T.type)
    X_train = X_train_T.drop_duplicates(keep='first').T
    X_test = X_test_T.drop_duplicates(keep='first').T
  
    # print("After third removal: ", X_train.shape)
    """
    
    data = data_quasi_filter
    
    return data

def drop_numerical_outliers(df, z_thresh=3):
    # Constrains will contain `True` or `False` depending on if it is a value below the threshold.

    """
    df_numerical = df.select_dtypes(exclude=['category','object']).columns()
    print("NUMERICAL CATEGORIES")
    print(df_numerical)


    z_scores = stats.zscore(df_numerical)
    abs_z_scores = np.abs(z_scores)
    filtered_entries = (abs_z_scores < z_thresh).all(axis=1)
    new_df = df_numerical[filtered_entries]

    """

    #print("SUMMARY OF NUMERICAL DATA BEFORE OUTLIERS ")
    #print(df.describe())

    #sns.boxplot(x=df['Age'])
    #plt.show()

    #print("SHAPE BEFORE")
    #print(df.shape)

    # these are numerical columns
    numerical_feature_mask = df.dtypes==np.number
    numerical_cols = df.columns[numerical_feature_mask].tolist()

    
    for col in numerical_cols:
        df['zscore'] = (df[col] - df[col].mean()) / df[col].std()
        df = df[(df.zscore>-3) & (df.zscore<3)]
        df.drop('zscore',axis=1,inplace=True)  

    #print("SHAPE AFTER")
    #print(df.shape)

    """
    


    Q1 = df[numerical_cols].quantile(0.25)
    Q3 = df[numerical_cols].quantile(0.75)
    IQR = Q3 - Q1

    df = df[~((df[numerical_cols] < (Q1 - 1.5 * IQR)) | (df[numerical_cols] > (Q3 + 1.5 * IQR))).any(axis=1)]

    #print("SUMMARY OF NUMERICAL DATA AFTER OUTLIERS ")
    #print(df.describe())

    #sns.boxplot(x=df['Age'])
    #plt.show()

    """

    return df

def one_hot_encoder(df,columns,enc_types):
    cat = df.select_dtypes(include='O').keys()
    for i in range (len(columns)):
        df=pd.get_dummies(df,columns=cat)
    return df

def label_encoding(df):
    lb=LabelEncoder()
    cat = df.select_dtypes(include='O').keys()
    for ime in cat:
        df[ime]=lb.fit_transform(df[ime])
    return df

def ordinal_encoding(dataframe, categorical_cols):
    oe = OrdinalEncoder()
    dataframe[categorical_cols] = dataframe[categorical_cols].apply(lambda col: oe.fit_transform(col))
    return dataframe

def binary_encoding(df):
    cat = df.select_dtypes(include='O').keys()
    for ime in cat:
        encoder=ce.BinaryEncoder(cols=[ime])
        df=encoder.fit_transform(df)
    return df


def encode_data(df, columns,enc_types):
    # data can be encoded in three ways
    # in order which one we chose, we have different approaches
    # switch to case
    
    # Categorical boolean mask
    #categorical_feature_mask = df.dtypes==object
    # filter categorical columns using mask and turn it into a list
    #categorical_cols = df.columns[categorical_feature_mask].tolist()
    
    #print("categorical columns are")
    #print(categorical_cols)

    #if (encoding == 'onehot'):
        #print("ENCODING ONE HOT ENCODER")
        #df = one_hot_encoder(df)
    #elif (encoding == 'label'):
        #print("ENCODING LABEL ENCODER")
        #df = label_encoding(df)
    #elif (encoding == 'ordinal'):
        #print("ENCODING ORDINAL ENCODER")
        #df = binary_encoding(df)

    print("Encode data")
    for i in range (len(columns)):
        print(enc_types[i])
        print(columns[i])
        print("---")

    for i in range (len(columns)):
        if (columns[i] not in df.columns):
            continue
        elif(enc_types[i]=='one hot'):
            df=pd.get_dummies(df,columns=[columns[i]])
        elif (enc_types[i]=='label'):
            lb=LabelEncoder()
            df[columns[i]]=lb.fit_transform(df[str(columns[i])])
        elif (enc_types[i]=='binary'):
            encoder=ce.BinaryEncoder(cols=[columns[i]])
            df=encoder.fit_transform(df)

    print(df)
    print("Encode data prosao")
    return (df)

def fill_na_values(df, missing):
    print("DATAFRAME BEFORE FILLING MISSING VALUES: ")
    print(df.head())
    i = 0 
    columnLength = len(df.columns)
    # print("column length is ", columnLength)

    for columnName in df.columns:
        filltype = missing[i]

        if (filltype == 'mean'):
            colMean = df[columnName].mean(skipna=True)
            df[columnName].fillna(value=colMean, inplace=True)
        elif (filltype == 'median'):
            colMedian = df[columnName].median(skipna=True)
            df[columnName].fillna(value=colMedian, inplace=True)
        elif (filltype == 'min'):
            colMin = df[columnName].min(skipna=True)
            df[columnName].fillna(value=colMin, inplace=True)
        elif (filltype == 'max'):
            colMax = df[columnName].min(skipna=True)
            df[columnName].fillna(value=colMax, inplace=True)
        elif (filltype == 'delete'):
            df.drop(columnName, inplace=True, axis=1)
        elif (filltype == 'top'):
            colMode = df.mode()[columnName][0]
            df[columnName].fillna(value=colMode, inplace=True)
        
        i = i+1
        if (i == columnLength-1):
            break

    print("DATAFRAME AFTER FILLING MISSING VALUES: ")
    print(df.head())
    return df
   

def num_to_cat (df,num_cat_col):
    print("num to cat")
    for i in range (len(num_cat_col)):
        df[num_cat_col[i]] = df[num_cat_col[i]].astype('category')
        print(df[num_cat_col[i]].dtypes)
    print("num to cat prosao")
    return df



def scale_data(X_train, X_test, y_train, y_test):
    #print("Before scaling: ")
    #print(X_train.shape)
    #print(X_train)
    #print(y_train.shape)
    #print(y_train)

    scaler=None
    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_test = scaler.transform(X_test)

    X_train.reshape(X_train.shape[0],X_train.shape[1],1)
    X_test.reshape(X_test.shape[0],X_test.shape[1],1)
    
    y_train = y_train.to_numpy()
    y_test = y_test.to_numpy()
    
    #print("After scaling: ")
    #print(X_train.shape)
    #print(X_train)
    #print(y_train.shape)
    #print(y_train)

    return (X_train, X_test, y_train, y_test)

def regression(X,y,type,X_train,y_train, hidden_layers_n, hidden_layer_neurons_list, activation_function_list,regularization,reg_rate,username):
    # here, we are making our model
    # type nam ukazuje koji je tip problema kojim se bavimo   !!!!!!!!!!!!!

    #print("SHAPE OF X TRAIN DATASET ", X_train.shape[0], " and ", X_train.shape[1])

    model=None
    model = Sequential()

   # print("DATA LOOKS LIKE THIS")
   # print(X_train)

    # input layer
    # should have same shape as number of input features (columns)
    #model.add(Flatten(input_shape=(X_train.shape[1],)))
    #model.add(Activation(activation=activation_function,input_shape=(X_train.shape[1],)))
    #normalizer=None
    #normalizer = Normalization(axis=-1)
    #normalizer.adapt(X_train)
    #model.add(normalizer)
    
    # input layer
    #if (hidden_layers_n > 0):
    #if(type=="regression"):
        #model.add(Dense(units=len(X_train.columns),input_shape=len(X_train.columns)))   #unitsi menjani
    #else:
    model.add(Dense(units=X.shape[1],input_dim=X.shape[1]))                      #unitsi menjani
    #else:
    #if(type=="regression"):
     #   model.add(Dense(units=1, input_shape=(len(X_train.columns))))
    #else:
     #       model.add(Dense(units=1, input_dim=X.shape[1]))

    # hidden layers
    #if (hidden_layers_n > 0):
    for i in range(hidden_layers_n):
        if(regularization=="L1"):
            model.add(Dense(hidden_layer_neurons_list[i], activation=activation_function_list[i],kernel_regularizer=tf.keras.regularizers.l1(l=reg_rate)))
        elif(regularization=="L2"):
                model.add(Dense(hidden_layer_neurons_list[i], activation=activation_function_list[i],kernel_regularizer=tf.keras.regularizers.l2(l=reg_rate)))
        else:
                model.add(Dense(hidden_layer_neurons_list[i], activation=activation_function_list[i]))

    if(type=="regression"):
        model.add(Dense(y.shape[1], activation='sigmoid'))
    else:
        model.add(Dense(y.shape[1], activation='softmax'))

  #  model.summary()

    dictionary[username]=model

    return model


#def f1_score(y_true, y_pred): #taken from old keras source code
#    true_positives = K.sum(K.round(K.clip(y_true * y_pred, 0, 1)))
#    possible_positives = K.sum(K.round(K.clip(y_true, 0, 1)))
#    predicted_positives = K.sum(K.round(K.clip(y_pred, 0, 1)))
#    precision = true_positives / (predicted_positives + K.epsilon())
#    recall = true_positives / (possible_positives + K.epsilon())
#    f1_val = 2*(precision*recall)/(precision+recall+K.epsilon())
#    return f1_val
def recall_m(y_true, y_pred):
    true_positives = K.sum(K.round(K.clip(y_true * y_pred, 0, 1)))
    possible_positives = K.sum(K.round(K.clip(y_true, 0, 1)))
    recall = true_positives / (possible_positives + 
    K.epsilon())
    return recall

def precision_m(y_true, y_pred):
    true_positives = K.sum(K.round(K.clip(y_true * y_pred, 0, 1)))
    predicted_positives = K.sum(K.round(K.clip(y_pred, 0, 1)))
    precision = true_positives / (predicted_positives + K.epsilon())
    return precision

def f1_score(y_true, y_pred):
    precision = precision_m(y_true, y_pred)
    recall = recall_m(y_true, y_pred)
    return 2*((precision*recall)/(precision+recall+K.epsilon()))


def compile_model(model, type, y,lr):
    # these are the best options for linear regression!!
    # common loss functions for 
    # binary classification: binary_crossentropy
    # multi class: sparse_categorical_crossentropy
    # regression: mse(Mean squared error)

    # also, there are multiple metrics that user can choose from
    reg_metrics = ['mae','mse','RootMeanSquaredError']
    class_metrics=['accuracy','AUC','Precision','Recall',f1_score]
    
    if (type == 'regression'):
        met = reg_metrics
        opt=tf.keras.optimizers.SGD(learning_rate=lr)
        loss = MeanSquaredError()
    else:
        met = class_metrics
        opt = tf.keras.optimizers.Adam(learning_rate=lr)
        if (y.shape[1] == 2):
            # binary classification
            loss = BinaryCrossentropy()
        else:
            loss = CategoricalCrossentropy()

    model.compile(optimizer=opt, loss=loss, metrics = met)
    return model 

def train_model(model,type, X_train, y_train, epochs, batch_size,X_val,y_val, X_test, y_test,path):

    call = epochResults()

    fit=model.fit(X_train, y_train, epochs=epochs,batch_size=batch_size, callbacks=[call] ,validation_data = (X_val, y_val), verbose=2)

    #if(path!=None):
    #    model.save(str(path))

    pred = model.predict(X_test) 
    if(type=="classification"):
        pred = np.argmax(pred, axis = 1)
        label = np.argmax(y_test,axis = 1)
        

    else:
        label2=y_test             #dodato
        label2=scaler.inverse_transform(label2)#dodato
        pred2=scaler.inverse_transform(pred)
        
                   
        #label=y_test.to_numpy(dtype ='float32')
        label=[]
        for i in range (len(label2)):
            label.append(label2[i][0])
            

        pred=[]
        for i in range (len(pred2)):
            pred.append(pred2[i][0])

        label=np.array(label)
        pred=np.array(pred)


    label=label.tolist()
    pred=pred.tolist()
    ev=model.evaluate(X_test,y_test)
    
    #ev=ev.tolist()
    #ev=pd.Series(ev)
    yield pred
    yield label
    yield dict(zip(model.metrics_names, ev))
    yield fit # VALIDATION DATA=(X_VAL, Y_VAL) 



def save_model(path,user):
    dictionary[user].save(str(path))




def missing_data(data):
    # if user decides to drop data containing nan values
    # question is should we drop rows or columns?
    # axis = 1 is for dropping columns
    # data.dropna(inplace=True)

    # find missing values, and replace with ideal or drop
    #print("MISSING DATA")
    #print(data.isna().sum())

    columns_numerical = data.select_dtypes(exclude=['category','object'])
    columns_categorical = data.select_dtypes(include=['category', 'object'])

    #print("COLUMNS THAT ARE NUMERICAL")
    #print(columns_numerical)

    #print("COLUMNS THAT ARE CATEGORICAL")
    #print(columns_categorical)

    missing_value_columns_numerical = columns_numerical.columns[columns_numerical.isna().any()].tolist()
    missing_value_columns_categorical = columns_categorical.columns[columns_categorical.isna().any()].tolist()

    #print("NUMERICKE KOLONE")
    #print(missing_value_columns_numerical)
    #print("KATEGORICKE KOLONE")
    #print(missing_value_columns_categorical)
    
    
    for mvc in missing_value_columns_numerical:
        # for every numerical column with missing values, calculate mean value and replace it
        col_mean = data[mvc].mean(skipna=True)
        data[mvc].fillna(value=col_mean, inplace=True)
    
    for mvc in missing_value_columns_categorical:
        # for every categorical column with missing values, calculate mode, or the value that appears most often
        col_mode = data[mvc].mode()[0]
        data[mvc].fillna(value=col_mode, inplace=True)

    #print("MISSING DATA")
    #print(data.isna().sum())
    
    return data