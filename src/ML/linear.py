import pandas as pd
import numpy as np
from sklearn.feature_selection import VarianceThreshold
from sklearn.preprocessing import StandardScaler

import tensorflow as tf
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.feature_selection import VarianceThreshold


import keras 
from keras.models import Sequential
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
    return X_train, X_test


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

def regression(shape, input_layer_neurons, hidden_layers_n, hidden_layer_neurons_list, activation_function):
    # here, we are making our model
    
    model = Sequential()
    model.add(Dense(224, activation=activation_function, input_shape=(shape,1)))

    #for i in range(hidden_layers_n):
    #    model.add(Dense(hidden_layer_neurons_list[i], activation=activation_function))
    
    model.add(Dense(1, activation=activation_function))

    return model

def compile_model(model):
    # these are the best options for linear regression
    model.compile(optimizer='sgd', loss=MeanSquaredError(), metrics=['accuracy','mse','mae','AUC'])
    
def train_model(model, X_train, y_train, epochs, X_test, y_test):
    return model.fit(X_train, y_train, epochs=epochs, validation_data = (X_test, y_test))

def evaluate_model(model, X_test, y_test):
    return model.evaluate(X_test, verbose=1, validation_data=(X_test, y_test))


def complete_process(url,label,epochs ,ratio, activation_function,input_layer_neurons, hidden_layers_n, hidden_layer_neurons_list):
    #load data
    data = load_data(url)

    # split features and label
    X, y = feature_and_label(data, label)
    
    # split data
    (X_train, X_test, y_train, y_test) = split_data(X , y , ratio)
    # print(X_train.shape)
    

    # filtering data
    (X_train, X_test) = filter_data(X_train, X_test)
    # print(X_train.shape)


    # scaling data
    (X_train, X_test, y_train, y_test) = scale_data(X_train, X_test,y_train, y_test )
    print("After all scaling: ", X_train.shape)

    
    # making model

    shape = X_train.shape[1]
    model = regression(shape,input_layer_neurons, hidden_layers_n, hidden_layer_neurons_list, activation_function)
    # compiling model
    compile_model(model)

    # training model
    history = train_model(model, X_train, y_train, epochs, X_test, y_test)
    # evaluate the model
    
    
    # print("The test accuracy is {}, and loss is {}".format(history.history['accuracy'], history.history['loss']))
    epoch_range = range(1, epochs+1)
    plt.plot(epoch_range, history.history['accuracy'])
    plt.plot(epoch_range, history.history['val_accuracy'])
    plt.title("Model accuracy")
    plt.ylabel("Accuracy")
    plt.xlabel("Epoch")
    plt.legend(['Train', 'Val'], loc='upper left')
    plt.show()

    plt.plot(epoch_range, history.history['loss'])
    plt.plot(epoch_range, history.history['val_loss'])
    plt.title("Model loss")
    plt.ylabel("Loss")
    plt.xlabel("Epoch")
    plt.legend(['Train', 'Val'], loc='upper left')
    plt.show()

    plt.plot(epoch_range, history.history['auc'])
    plt.plot(epoch_range, history.history['val_auc'])
    plt.title("Model AUC")
    plt.ylabel("AUC")
    plt.xlabel("Epoch")
    plt.legend(['Train', 'Val'], loc='upper left')
    plt.show()
    




