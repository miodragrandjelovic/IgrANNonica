from xml.etree.ElementInclude import include
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import tensorflow as tf
from tensorflow import keras
from sklearn.model_selection import train_test_split
from pandas.api.types import is_string_dtype
from pandas.api.types import is_numeric_dtype

df=pd.read_csv("src\ML\mpg.csv")

df.head(10)
###

y = df.pop("hwy")
y.columns = "hwy"

X_train, X_test, y_train, y_test = train_test_split(df, y, test_size = 0.2)

cat = df.select_dtypes(include='O').keys()
X_train=pd.get_dummies(X_train,columns=cat)
X_test=pd.get_dummies(X_test,columns=cat)

for name in cat:
    if(y_train.name==name):
        y_train=pd.get_dummies(y_train,columns=name)

for name in cat:
    if(y_test.name==name):
        y_test=pd.get_dummies(y_test,columns=name)


for (columnName,columnData) in X_train.iteritems():
    X_train[str(columnName)]=X_train[str(columnName)]/X_train[str(columnName)].max()

for (columnName,columnData) in X_test.iteritems():
    X_test[str(columnName)]=X_test[str(columnName)]/X_test[str(columnName)].max()

y_train=y_train.astype(float)
max=y_train.max()
for i in y_train.index:
    y_train[i]=y_train[i]/max

y_test=y_test.astype(float)
max=y_test.max()
for i in y_test.index:
    y_test[i]=y_test[i]/max

model=None

len(y_test)

model=keras.Sequential()