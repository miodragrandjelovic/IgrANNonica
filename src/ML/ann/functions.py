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
    sc=StandardScaler()
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



def encode_data(df, columns,enc_types):

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


def regression(X,y,type,X_train,y_train, hidden_layers_n, hidden_layer_neurons_list, activation_function_list,regularization,reg_rate,username):

    model=None
    model = Sequential()

    model.add(Dense(units=X.shape[1],input_dim=X.shape[1]))                      #unitsi menjani
   
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


    dictionary[username]=model

    return model

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


    fit=model.fit(X_train, y_train, epochs=epochs,batch_size=batch_size ,validation_data = (X_val, y_val), verbose=2)

    pred = model.predict(X_test) 
    if(type=="classification"):
        pred = np.argmax(pred, axis = 1)
        label = np.argmax(y_test,axis = 1)
        

    else:
        label2=y_test             #dodato
        label2=scaler.inverse_transform(label2)#dodato
        print(pred)
        pred2=scaler.inverse_transform(pred)
        print(pred2)
                   
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
