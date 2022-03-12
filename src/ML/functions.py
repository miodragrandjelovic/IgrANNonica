import pandas as pd
import numpy as np
from sklearn.feature_selection import VarianceThreshold
from sklearn.preprocessing import StandardScaler, scale

import tensorflow as tf
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.feature_selection import VarianceThreshold


import keras 
from keras.models import Sequential
from keras import Input
from keras.layers import Flatten, Dense, BatchNormalization, Dropout, MaxPool1D, Conv1D
from keras.losses import MeanSquaredError


def load_data(url):
    data = pd.read_csv(url)
    return data

def feature_and_label(data, label):
    y = data.pop(label)
    return data,y

def split_data(X, y, ratio):
    (X_train, X_test, y_train, y_test) = train_test_split(X, y, test_size = 1-ratio, random_state=0)
    return (X_train, X_test, y_train, y_test)

def filter_data(X_train, X_test):
    # first, removing data with constant value

    #print("BEFORE FILTERING")
    #print(X_train.head())

    constant_filter = VarianceThreshold(threshold=0)
    constant_filter.fit(X_train)
    constant_list = [not temp for temp in constant_filter.get_support()]
    X_train_filter = constant_filter.transform(X_train)
    X_test_filter = constant_filter.transform(X_test)
    # print("After first removal: ", X_train.shape)

    # now, removing Quasi constants, which are not big influence on data
    quasi_constant_filter = VarianceThreshold(threshold=0.01)
    quasi_constant_filter.fit(X_train_filter)
    X_train_quasi_filter = quasi_constant_filter.transform(X_train_filter)
    X_test_quasi_filter = quasi_constant_filter.transform(X_test_filter)
    # print("After second removal: ", X_train.shape)

    #remove duplicates
    X_train_T = X_train_quasi_filter.T
    X_test_T = X_test_quasi_filter.T
    X_train_T = pd.DataFrame(X_train_T)
    X_test_T = pd.DataFrame(X_test_T)
    duplicated_features = X_train_T.duplicated()
    features_to_keep = [not index for index in duplicated_features]
    X_train = X_train_T[features_to_keep].T
    X_test = X_test_T[features_to_keep].T
    # print("After third removal: ", X_train.shape)

    #print("AFTER FILTERING")
    #print(X_train.head())

    return X_train, X_test

def encode_categorical(X_train, X_test, encoding):
    
    return (X_train, X_test)

def scale_data(X_train, X_test, y_train, y_test):
    # print("Before scaling: ", X_train.shape)
    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_test = scaler.transform(X_test)

    # print("Before reshaping: ", X_train.shape)
    X_train.reshape(X_train.shape[0],X_train.shape[1],1)
    X_test.reshape(X_test.shape[0],X_test.shape[1],1)
    #print("After reshaping: ", X_train.shape)
    
    y_train = y_train.to_numpy()
    y_test = y_test.to_numpy()
   
    return (X_train, X_test, y_train, y_test)

def regression(X_train, input_layer_neurons, hidden_layers_n, hidden_layer_neurons_list, activation_function):
    # here, we are making our model
    
    #print("SHAPE OF X TRAIN DATASET ", X_train.shape[0], " and ", X_train.shape[1])
    model = Sequential()

    # input layer
    # should have same shape as number of input features (columns)
    model.add(Input(shape=(X_train.shape[1],)))
    
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

    model.summary()
    return model

def regression_2(X_train, input_layer_neurons, hidden_layers_n, hidden_layer_neurons_list, activation_function):
    model = Sequential()
    model.add(Conv1D(32, 3, activation='relu', input_shape=(X_train.shape[1],1)))
    model.add(BatchNormalization())
    model.add(MaxPool1D(2))
    model.add(Dropout(0.3))

    model.add(Conv1D(64, 3, activation='relu'))
    model.add(BatchNormalization())
    model.add(MaxPool1D(2))
    model.add(Dropout(0.5))

    model.add(Conv1D(128, 3, activation='relu'))
    model.add(BatchNormalization())
    model.add(MaxPool1D(2))
    model.add(Dropout(0.5))

    model.add(Flatten())
    model.add(Dense(X_train.shape[1], activation='relu'))
    model.add(Dropout(0.5))

    model.add(Dense(1, activation='sigmoid'))


    return model



def compile_model(model):
    # these are the best options for linear regression!!
    model.compile(optimizer='sgd', loss=MeanSquaredError(), metrics=['accuracy','mse','mae','AUC'])
    return model 

def train_model(model, X_train, y_train, epochs, X_test, y_test):
    return model.fit(X_train, y_train, epochs=epochs, validation_data = (X_test, y_test))

def evaluate_model(model, X_test, y_test):
    return model.evaluate(X_test, verbose=1, validation_data=(X_test, y_test))
   
