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



print("done")