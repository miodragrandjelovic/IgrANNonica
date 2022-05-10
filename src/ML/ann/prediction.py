import numpy as np
import pandas as pd
import category_encoders as ce
from sklearn.preprocessing import StandardScaler,LabelEncoder,MinMaxScaler
import tensorflow as tf


def predikcija(path,origcsv,predcsv,type,columns,encodings,num_cat,output):
    
    model = tf.keras.models.load_model(path)
    predict=predcsv
    df=origcsv
    put=df.pop(output)
    
    for i in range (len(columns)):
        if(encodings[i]=='onehot'):
            predict=pd.get_dummies(predict,columns=columns[i])
        elif (encodings[i]=='label'):
            lb=LabelEncoder()
            predict[columns[i]]=lb.fit_transform(predict[columns[i]])
        elif (encodings[i]=='binary'):
            encoder=ce.BinaryEncoder(cols=columns[i])
            predict=encoder.fit_transform(predict)


    for i in range (len(num_cat)):
        predict[num_cat[i]]=pd.Categorical(predict[num_cat[i]])


    for i in range (len(columns)):
        if(encodings[i]=='onehot'):
            df=pd.get_dummies(df,columns=columns[i])
        elif (encodings[i]=='label'):
            lb=LabelEncoder()
            df[columns[i]]=lb.fit_transform(df[columns[i]])
        elif (encodings[i]=='binary'):
            encoder=ce.BinaryEncoder(cols=columns[i])
            df=encoder.fit_transform(df)

    for i in range (len(num_cat)):
        df[num_cat[i]]=pd.Categorical(df[num_cat[i]])

    ### gotovo enkodiranje

    
    result = pd.concat([df, predict], ignore_index=True, sort=False)

    result2=result[0:len(predict)]

    if(type=="regression"):
        scaler2=MinMaxScaler()
        result2=scaler2.fit_transform(result2)

        pred2 = model.predict(result2) 

        put=pd.DataFrame(put)
        put=scaler2.fit_transform(put)
        put=scaler2.inverse_transform(put)

        pred2=scaler2.inverse_transform(pred2)
        return pred2

    else:
        scaler2=StandardScaler()
        result2=scaler2.fit_transform(result2)


        pred2 = model.predict(result2) 

        pred2 = np.argmax(pred2, axis = 1) 

        return pred2
