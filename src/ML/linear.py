from tabnanny import verbose
import pandas as pd
import numpy as np

import tensorflow as tf
import matplotlib.pyplot as plt
import seaborn as sns


from sklearn.model_selection import train_test_split

import keras 
from keras.models import Sequential
from keras.layers import Flatten, Dense, BatchNormalization
from keras.losses import MeanSquaredError

def load_data(url):
    data = pd.read_csv(url)
    return data

def feature_and_label(data, label):
    y = data.pop(label)
    return y

def split_data(X, y, ratio):
    (X_train, X_test, y_train, y_test) = train_test_split(X, y, test_size = ratio)
    return (X_train, X_test, y_train, y_test)


def regression(input_layer_neurons, hidden_layers_n, hidden_layer_neurons_list, activation_function, shape):
    # here, we are making our model
    model = Sequential()

    # we have input layer
    model.add(Flatten(input_shape=(shape, 1)))

    # now adding hidden layers
    for i in range(hidden_layers_n):
        model.add(Dense(hidden_layer_neurons_list[i], activation=activation_function))
    
    # adding output layer
    # it should have only one neuron for linear regression, and n neurons for classification
    model.add(Dense(1, activation_function))

    return model

def compile_model(model):
    # these are the best options for linear regression
    model.compile(optimizer='sgd', loss=MeanSquaredError(), metrics=['mse','mae','AUC'])
    
def train_model(model, X_train, y_train, epochs):
    model.fit(X_train, y_train, epochs=epochs)

def evaluate_model(model, X_test):
    return model.evaluate(X_test, verbose=1)


def complete_process(url,label,epochs ,ratio, activation_function,input_layer_neurons, hidden_layers_n, hidden_layer_neurons_list):
    #load data
    X = load_data(url)
    # split features and label

    X_train.head()
    X_train.shape[1]

    y = feature_and_label(X, label)
    # split data
    (X_train, X_test, y_train, y_test) = split_data(X , y , ratio)
    # making model
    shape = X_train.shape[1]
    model = regression(input_layer_neurons, hidden_layers_n, hidden_layer_neurons_list, activation_function, shape)
    # compiling model
    compile_model(model)
    # training model
    train_model(model, X_train, y_train, epochs)
    # evaluate the model
    test_loss, test_accuracy = evaluate_model(model, X_test)
    print("The test accuracy is {}, and loss is {}".format(test_accuracy, test_loss))


url = './src/ML/train.csv'
label = 'TARGET'
epochs = 10
ratio = 0.9
activation_function = 'relu'
input_layer_neurons = 32
hidden_layers_n = 4
hidden_layer_neurons_list = [50,50,50,50]
complete_process('./src/ML/train.csv','TARGET', 10, 0.9, 'relu', 32, 4, [50,50,50,50])
