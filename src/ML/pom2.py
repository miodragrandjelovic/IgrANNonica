import pandas as pd
from sklearn import metrics
import tensorflow as tf
from tensorflow import keras
from sklearn.model_selection import train_test_split
from pandas.api.types import is_string_dtype
from pandas.api.types import is_numeric_dtype
from keras import layers
from keras.losses import MeanSquaredError
from sklearn.preprocessing import LabelEncoder
import category_encoders as ce


df=pd.read_csv("src\ML\mpg.csv")

df.head(10)

pom=df.copy()

y = pom.pop("class")
y.columns = "class"

cat = pom.select_dtypes(include='O').keys()
pom=pd.get_dummies(pom,columns=cat)
pom
y=pd.Series(y)
y=pd.get_dummies(y)



for (columnName,columnData) in pom.iteritems():
    pom[str(columnName)]=columnData/columnData.max()

for (columnName,columnData) in y.iteritems():
    y[str(columnName)]=columnData/columnData.max()


X_train, X_test, y_train, y_test = train_test_split(pom, y, test_size = 0.2)

model=None

model=keras.Sequential()
"""
normalizer=None
normalizer = layers.Normalization(axis=-1)
normalizer.adapt(X_train)
model.add(normalizer)
"""
len(X_train.columns)

model.add(layers.Dense(units=32,input_shape=(len(X_train.columns),)))
model.add(layers.Dense(units=32,activation='relu'))
model.add(layers.Dense(units=646,activation='relu'))
len(y_train.columns)
model.add(layers.Dense(len(y_train.columns), activation="relu"))

model.compile(optimizer='adam', loss=MeanSquaredError(),metrics=['accuracy','mae','mse'])

hist=model.fit(X_train, y_train, epochs=15,batch_size=10, validation_data = (X_test, y_test), verbose=1)