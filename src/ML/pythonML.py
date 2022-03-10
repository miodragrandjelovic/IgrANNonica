from sklearn import metrics
import tensorflow as tf
from tensorflow import keras
from keras import Sequential

from keras.layers import Conv1D, MaxPool1D, Flatten, Dense, Dropout, BatchNormalization
from keras.optimizer_v1 import Adam
print(tf.__version__)

import numpy as np
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.feature_selection import VarianceThreshold

# dataset
data = pd.read_csv("./src/ML/train.csv")
data.head()
data.info

data.shape

X = data.drop(labels=['ID', 'TARGET'], axis=1)
X.shape

y = data['TARGET']

X_train, X_test, y_train, y_test = train_test_split(X,y,test_size=0.2, random_state=0, stratify=y)


X_train.shape, X_test.shape

# sada uklanjamo kolone koje zapravo nemaju nikakvo znacenje
# QUASI constants removal

constant_filter = VarianceThreshold(threshold=0)
constant_filter.fit(X_train)

constant_filter.get_support().sum()

constant_list = [not temp for temp in constant_filter.get_support()]
constant_list

X.columns[constant_list]

X_train_filter = constant_filter.transform(X_train)
X_test_filter = constant_filter.transform(X_test)

X_train_filter.shape, X_test_filter.shape, X_train.shape

# Quasi removal

quasi_constant_filter = VarianceThreshold(threshold=0.01)

quasi_constant_filter.fit(X_train_filter)
quasi_constant_filter.get_support().sum()

X_train_quasi_filter = quasi_constant_filter.transform(X_train_filter)
X_test_quasi_filter = quasi_constant_filter.transform(X_test_filter)

X_train_quasi_filter.shape, X_test_quasi_filter.shape

# remove duplicate features
X_train_T = X_train_quasi_filter.T
X_test_T = X_test_quasi_filter.T

type(X_train_T)

X_train_T = pd.DataFrame(X_train_T)
X_test_T = pd.DataFrame(X_test_T)

X_train_T.shape, X_test_T.shape

X_train_T.duplicated().sum()

duplicated_features = X_train_T.duplicated()
duplicated_features

features_to_keep = [not index for index in duplicated_features]
features_to_keep

X_train = X_train_T[features_to_keep].T
X_train.shape

X_test = X_test_T[features_to_keep].T
X_test.shape

X_train.head()

scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

X_train.shape, X_test.shape

X_train.reshape(8000,224,1)
X_test.reshape(2000,224,1)

y_train = y_train.to_numpy()
y_test = y_test.to_numpy()

####### BUILD CNN

model = Sequential()
model.add(Conv1D(32, 3, activation='relu', input_shape=(224,1)))
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
model.add(Dense(224, activation='relu'))
model.add(Dropout(0.5))

model.add(Dense(1, activation='sigmoid'))

model.summary()

model.compile(optimizer = 'adam', loss='binary_crossentropy', metrics=['accuracy','AUC'] )
history = model.fit(X_train, y_train, epochs=10, validation_data = (X_test, y_test), verbose=1)



def plot_learning_curve(history, epoch):
    #plot training and validation accuracy values
    epoch_range = range(1, epoch+1)
    plt.plot(epoch_range, history.history['accuracy'])
    plt.plot(epoch_range, history.history['val_accuracy'])
    plt.title("Model accuracy")
    plt.ylabel("Accuracy")
    plt.xlabel("Epoch")
    plt.legend(['Train', 'Val'], loc='upper left')
    plt.show()

    #plot training and validation loss values
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

plot_learning_curve(history, 10)
