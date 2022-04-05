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
import numpy as np

df=pd.read_csv("src\ML\mpg.csv")

df.head(10)
###

cat = df.select_dtypes(include='O').keys()
cat
##one hot encoding
df=pd.get_dummies(df,columns=cat)



##
lb=LabelEncoder()
for ime in cat:
    df[ime]=lb.fit_transform(df[ime])

##binary encoding
for ime in cat:
    encoder=ce.BinaryEncoder(cols=[ime])
    df=encoder.fit_transform(df)


for (columnName,columnData) in df.iteritems():
    df[str(columnName)]=columnData/columnData.max()
#df[str(columnName)]=df[str(columnName)]/df[str(columnName)].max()
pom=df.copy()

y = pom.pop("hwy")
#y.columns = "hwy"

X_train, X_test, y_train, y_test = train_test_split(pom, y, test_size = 0.2)


X_train

"""
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
"""

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
model.add(layers.Dense(units=16,activation='relu'))
model.add(layers.Dense(1, activation="relu"))

model.compile(optimizer='adam', loss=MeanSquaredError(),metrics=['mae','mse'])

hist=model.fit(X_train, y_train, epochs=15,batch_size=10, validation_data = (X_test, y_test), verbose=1)

pred = model.predict(X_test) 
model.evaluate(X_test,y_test)
pred
y_test
y_test.type



def is_float(element) -> bool:
    try:
        float(element)
        return True
    except ValueError:
        return False

df=pd.DataFrame([["2.3","Pera","1"],["3.2","Mika","4"],["1.1","Laza","2"]])

df.columns=["floatovi","imena","int"]

for (columnName,columnData) in df.iteritems():
        if(is_float(df[str(columnName)][0]) or df[str(columnName)][0].isnumeric()):
            df[str(columnName)]=df[str(columnName)].astype(float)


df
df["floatovi"]