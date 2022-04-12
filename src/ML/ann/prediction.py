import numpy as np
from sklearn.preprocessing import StandardScaler
import tensorflow as tf

from functions import encode_data,normalize

def predikcija(path,csv):
    model = tf.keras.models.load_model(path)
    X=csv
    X=encode_data(X, "onehot")
    
    if (type == "regression"):
        X=normalize(X)

    if(type == "classification"):
        scaler=StandardScaler()
        X=scaler.fit_transform(X)

    pred = model.predict(X) 
    if(type=="classification"):
        pred = np.argmax(pred, axis = 1)

    return pred.tolist() 
