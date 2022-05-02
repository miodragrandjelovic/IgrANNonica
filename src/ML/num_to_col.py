import numpy as np
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
from sklearn.preprocessing import StandardScaler



from keras.utils import np_utils

df=pd.read_csv("src\ML\Churn_Modelling.csv")

df.head(10)

X=df.drop(labels=["CustomerId","Surname","RowNumber","Geography"],axis=1)
y=df["Geography"]
cat = X.select_dtypes(include='O').keys()
cat
lb=LabelEncoder()
for ime in cat:
    X[ime]=lb.fit_transform(X[ime])

y=lb.fit_transform(y)

y=np_utils.to_categorical(y)

X['Exited']=np_utils.to_categorical(X['Exited'])


X_train, X_rem, y_train, y_rem = train_test_split(X,y, train_size=0.7)

X_valid, X_test, y_valid, y_test = train_test_split(X_rem,y_rem, test_size=0.5)


scaler=StandardScaler()

X_train=scaler.fit_transform(X_train)
X_valid=scaler.fit_transform(X_valid)
X_test=scaler.fit_transform(X_test)

model=None
model =  keras.Sequential()
model.add(layers.Dense(8, input_dim=X.shape[1], activation='tanh'))
model.add(layers.Dense(16, activation='tanh'))
model.add(layers.Dense(16, activation='tanh'))
model.add(layers.Dense(16, activation='tanh'))
model.add(layers.Dense(y.shape[1], activation='softmax'))
# Compile model
model.compile(loss='categorical_crossentropy', optimizer='adam', metrics=['accuracy','AUC'])

model.fit(X_train,y_train,batch_size=15,epochs=10, validation_data = (X_valid, y_valid),verbose=1)

pred = model.predict(X_test) 
ev=model.evaluate(X_test,y_test)

pred = np.argmax(pred, axis = 1) 
label = np.argmax(y_test,axis = 1) 

pred=pd.Series(pred)
ev=pd.DataFrame(ev)

print(pred) 
print(label)
