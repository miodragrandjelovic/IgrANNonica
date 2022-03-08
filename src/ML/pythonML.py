import pandas as pd
import numpy as np
import seaborn as sns
import tensorflow as tf
import matplotlib.pyplot as plt


from tensorflow import keras
from keras import layers


from sklearn.model_selection import train_test_split
from sklearn.preprocessing import normalize

from keras import Sequential



# load data from csv file
wine_quality = pd.read_csv("./src/ML/WineQT.csv", index_col=0)

# print data info and column headers
print(wine_quality.head())
print(wine_quality.info())

# checking if there is any NA columns
print(wine_quality.isna().sum()) if (wine_quality.isna().sum().any() > 0) else print("Data is clean")

# checking mean quality grade
print("Mean value of wine quality is ",wine_quality['quality'].mean())

# splitting the train and test dataset
# train dataset is 80% of the whole dataset
train_wd = wine_quality.sample(frac=0.8, random_state=0)
test_wd = wine_quality.drop(train_wd.index)

# making train and test dataset labels without quality column
train_labels = train_wd.pop('quality')
test_labels = test_wd.pop('quality')

# normalizing train and test data
normed_train_data = normalize(train_wd)
normed_test_data = normalize(test_wd)

# making function for sequential model for training
# model with 5 layers and relu activation function
# number of neurons : 64, 128, 32, 16, 1
def build_model():
    model = Sequential([
        layers.Dense(64,activation="relu",input_shape=[len(train_wd.keys())]),
        layers.Dense(128,activation="relu",name="layer2"),
        layers.Dense(32,activation="relu",name="layer3"),
        layers.Dense(16,activation="relu",name="layer4"),
        layers.Dense(1,name="layer5"),
    ])

    # optimizing the model
    model.compile(loss='mse', optimizer='adam', metrics=['mae', 'mse'])
    return model



# building the optimized model
model = build_model()

################################################################################
# training the dataset using our built model


print("done")