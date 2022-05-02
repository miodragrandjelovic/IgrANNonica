import numpy as np
import pandas as pd
from tensorflow import keras
from sklearn.model_selection import train_test_split
from keras import layers
from keras.losses import MeanSquaredError
from sklearn.preprocessing import LabelEncoder
from sklearn.preprocessing import MinMaxScaler

df=pd.read_csv("src\ML\mpg.csv")

df.head(10)

pom=df.copy()

y = pom.pop("hwy")
y.columns = "hwy"

cat = pom.select_dtypes(include='O').keys()

pom=pd.get_dummies(pom,columns=cat)
pom


scaler=MinMaxScaler()


X_train, X_test, y_train, y_test = train_test_split(pom, y, test_size = 0.2)

X_train=scaler.fit_transform(X_train)
X_test=scaler.fit_transform(X_test)

y_train=pd.DataFrame(y_train)
y_test=pd.DataFrame(y_test)


y_train=scaler.fit_transform(y_train)
y_test=scaler.fit_transform(y_test)


model=None


model=keras.Sequential()

len(X_train.columns)

model.add(layers.Dense(units=32,input_shape=(len(X_train.columns)), activation="relu"))
model.add(layers.Dense(units=32,activation='relu'))
model.add(layers.Dense(units=64,activation='relu'))
len(y_train.columns)
model.add(layers.Dense(1, activation="relu"))

model.compile(optimizer='adam', loss=MeanSquaredError(),metrics=['mae'])

model.fit(X_train, y_train, epochs=15,batch_size=10, validation_data = (X_test, y_test), verbose=1)


pred = model.predict(X_test) 
model.evaluate(X_test,y_test)

pred
y_test=scaler.inverse_transform(y_test)

y_test
pred=scaler.inverse_transform(pred)
####

predict=pd.read_csv("src\ML\mpgPredict.csv")

predict

hwy=predict.pop('hwy')
df.pop('hwy')
len(predict)

pom

cat2 = predict.select_dtypes(include='O').keys()

predict=pd.get_dummies(predict,columns=cat2)

df=pd.get_dummies(df,columns=cat)

result = pd.concat([df, predict], ignore_index=True, sort=False)

result

result2=result[0:len(predict)]


scaler2=MinMaxScaler()
result2=scaler2.fit_transform(result2)



pred2 = model.predict(result2) 
pred2

hwy=pd.DataFrame(hwy)
hwy=scaler2.fit_transform(hwy)
hwy=scaler2.inverse_transform(hwy)
hwy

pred2=scaler2.inverse_transform(pred2)
pred2




