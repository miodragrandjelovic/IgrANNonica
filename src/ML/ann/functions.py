from tkinter.ttk import Label
import pandas as pd
import numpy as np
from sklearn.feature_selection import VarianceThreshold
from sklearn.linear_model import SGDClassifier, SGDRegressor
from sklearn.preprocessing import LabelEncoder, OneHotEncoder, OrdinalEncoder, StandardScaler, scale
from sklearn.utils import shuffle


import tensorflow as tf
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.feature_selection import VarianceThreshold


import keras 
from keras.models import Sequential
from keras import Input
from keras.layers import Flatten, Dense, BatchNormalization, Dropout, MaxPool1D, Conv1D, Activation, Normalization
from keras.losses import MeanSquaredError
from keras.optimizer_v2 import adam


def load_data(features, label, data ):
    # moze da se prosledi i kao json string
    # data = pd.read_json(url)
    #data = pd.read_csv(url)
    features.append(label)
    
    #print("FEATURES TO KEEP")
    #print(features)

    
    data = data[features]
    data.columns = features

    #print("DATA IS")
    #print(data.head())

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

def split_data(X, y, ratio, randomize):
    (X_train, X_test, y_train, y_test) = train_test_split(X, y, test_size = 1-ratio, random_state=5)
    return (X_train, X_test, y_train, y_test)

def filter_data(X_train, X_test):
    # check for duplicate rows
    X_train.drop_duplicates(inplace=True, keep='first')

    # first, removing data with constant value
    constant_filter = VarianceThreshold(threshold=0)
    constant_filter.fit(X_train)
    constant_list = [column for column in X_train.columns if column not in X_train.columns[constant_filter.get_support()]]
    #print("COLUMS THAT ARE CONSTANT ARE ", constant_list)
    X_train_filter = constant_filter.transform(X_train)
    X_test_filter = constant_filter.transform(X_test)
    # print("After first removal: ", X_train.shape)

    # now, removing Quasi constants, which are not big influence on data
    quasi_constant_filter = VarianceThreshold(threshold=0.01)
    quasi_constant_filter.fit(X_train_filter)
    quasi_constant_list = [column for column in X_train.columns if column not in X_train.columns[constant_filter.get_support()]]
    #print("COLUMS THAT ARE QUASI CONSTANT ARE ", quasi_constant_list)
    X_train_quasi_filter = quasi_constant_filter.transform(X_train_filter)
    X_test_quasi_filter = quasi_constant_filter.transform(X_test_filter)
    # print("After second removal: ", X_train.shape)

    """
    # remove duplicates in terms of columns
    X_train_T = X_train_quasi_filter.T
    X_test_T = X_test_quasi_filter.T
    print("Type of data is ", X_train_T.type)
    X_train = X_train_T.drop_duplicates(keep='first').T
    X_test = X_test_T.drop_duplicates(keep='first').T
  
    # print("After third removal: ", X_train.shape)
    """

    return X_train, X_test

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

def one_hot_encoder(dataframe, categorical_cols):
    # instantiate OneHotEncoder
    ohe = OneHotEncoder(sparse=False) 
    # categorical_features = boolean mask for categorical columns
    # sparse = False output an array not sparse matrix

    oh_frame = ohe.fit_transform(dataframe[categorical_cols])
    #print(oh_frame)

    data_ohe = pd.DataFrame(oh_frame, index = dataframe.index)
    dataframe_noncategorical = dataframe.drop(columns=categorical_cols)
    dataframe = pd.concat([dataframe_noncategorical, data_ohe], axis=1)
    return dataframe

def label_encoding(dataframe, categorical_cols):
    le = LabelEncoder()
    # apply le on categorical feature columns
    dataframe[categorical_cols] = dataframe[categorical_cols].apply(lambda col: le.fit_transform(col))
    #dataframe[categorical_cols].head(10)
    return dataframe

def ordinal_encoding(dataframe, categorical_cols):
    oe = OrdinalEncoder()
    dataframe[categorical_cols] = dataframe[categorical_cols].apply(lambda col: oe.fit_transform(col))
    return dataframe

def encode_data(df, encoding):
    # data can be encoded in three ways
    # in order which one we chose, we have different approaches
    # switch to case
    
    # Categorical boolean mask
    categorical_feature_mask = df.dtypes==object
    # filter categorical columns using mask and turn it into a list
    categorical_cols = df.columns[categorical_feature_mask].tolist()
    
    #print("categorical columns are")
    #print(categorical_cols)

    if (encoding == 'onehot'):
        #print("ENCODING ONE HOT ENCODER")
        df = one_hot_encoder(df, categorical_cols)
    elif (encoding == 'label'):
        #print("ENCODING LABEL ENCODER")
        df = label_encoding(df, categorical_cols)
    elif (encoding == 'ordinal'):
        #print("ENCODING ORDINAL ENCODER")
        df = ordinal_encoding(df, categorical_cols)

    return (df)


def scale_data(X_train, X_test, y_train, y_test):
    print("Before scaling: ", X_train.shape)
    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_test = scaler.transform(X_test)

    print("Before reshaping: ", X_train.shape)
    X_train.reshape(X_train.shape[0],X_train.shape[1],1)
    X_test.reshape(X_test.shape[0],X_test.shape[1],1)
    print("After reshaping: ", X_train.shape)
    
    y_train = y_train.to_numpy()
    y_test = y_test.to_numpy()
   
    return (X_train, X_test, y_train, y_test)

def showdata(X_train, X_test, y_train,y_test):
    print("X TRAIN DATA ")
   
    print(X_train.shape)
    print(X_train.describe())
    print(X_train.head())
    #print(X_train)

    print("Thats it")
    print()
    print()

def regression(X_train, hidden_layers_n, hidden_layer_neurons_list, activation_function):
    # here, we are making our model
    
    #print("SHAPE OF X TRAIN DATASET ", X_train.shape[0], " and ", X_train.shape[1])
    model = Sequential()

    # input layer
    # should have same shape as number of input features (columns)
    #model.add(Flatten(input_shape=(X_train.shape[1],)))
    #model.add(Activation(activation=activation_function,input_shape=(X_train.shape[1],)))
    normalizer = Normalization(axis=-1)
    normalizer.adapt(X_train)
    model.add(normalizer)

    # hidden layers
    for i in range(hidden_layers_n):
        model.add(Dense(hidden_layer_neurons_list[i], activation=activation_function))

    # the output layer has one output number
    # it should have same shape as deisred prediction
    # usually, for categorical model, we have number of neurons equal to number of classification
    # if we have regressional model, we use just one neuron, which says expected number
    # if it's 0, the customer is satisfied
    # if it's 2, the customer is not satisfied
    model.add(Dense(1, activation=activation_function))

    #model.summary()
    return model


def compile_model(model, learning_rate):
    # these are the best options for linear regression!!
    # common loss functions for 
    # binary classification: binary_crossentropy
    # multi class: sparse_categorical_crossentropy
    # regression: mse(Mean squared error)

    # also, there are multiple metrics that user can choose from
    model.compile(optimizer='sgd', loss=MeanSquaredError(), metrics=['accuracy','mse','mae','AUC'])
    return model 

def train_model(model, X_train, y_train, epochs, batch_size, X_test, y_test):
    #print(X_train.shape)
    #print(X_train)

    # during the training of a model , we need to monitor the process, and send the data to front, so the user can have an overview
    # for this, we need to use callbacks argument
    # ovde se javlja greska kod svih aktivacionih funkcija sem sigmoid!!
    
    """
    print("X TRAIN")
    print(pd.DataFrame(X_train).describe())

    print("Y TRAIN")
    print(pd.DataFrame(y_train).describe())

    print("X TEST")
    print(pd.DataFrame(X_test).describe())

    print("Y TEST")
    print(pd.DataFrame(y_test).describe())
    """

    return model.fit(X_train, y_train, epochs=epochs,batch_size=batch_size, validation_data = (X_test, y_test), verbose=1) # VALIDATION DATA=(X_VAL, Y_VAL) 

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