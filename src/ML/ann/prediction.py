import numpy as np
from sklearn.preprocessing import StandardScaler
import tensorflow as tf

import ann.functions as fn

def predikcija(path,csv):
    model = tf.keras.models.load_model(path)
    X=csv
    X=fn.encode_data(X, "onehot")
    
    if (type == "regression"):
        X=fn.normalize(X)

    if(type == "classification"):
        scaler=StandardScaler()
        X=scaler.fit_transform(X)

    pred = model.predict(X) 
    if(type=="classification"):
        pred = np.argmax(pred, axis = 1)

    return pred.tolist() 
