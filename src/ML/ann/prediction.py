import numpy as np
import pandas as pd
import category_encoders as ce
from sklearn.preprocessing import StandardScaler,LabelEncoder,MinMaxScaler
import tensorflow as tf
import keras.backend as K

def recall_m(y_true, y_pred):
    true_positives = K.sum(K.round(K.clip(y_true * y_pred, 0, 1)))
    possible_positives = K.sum(K.round(K.clip(y_true, 0, 1)))
    recall = true_positives / (possible_positives + 
    K.epsilon())
    return recall

def precision_m(y_true, y_pred):
    true_positives = K.sum(K.round(K.clip(y_true * y_pred, 0, 1)))
    predicted_positives = K.sum(K.round(K.clip(y_pred, 0, 1)))
    precision = true_positives / (predicted_positives + K.epsilon())
    return precision

def f1_score(y_true, y_pred):
    precision = precision_m(y_true, y_pred)
    recall = recall_m(y_true, y_pred)
    return 2*((precision*recall)/(precision+recall+K.epsilon()))

def predikcija(path,origcsv,predcsv,type,columns,encodings,num_cat,output):
    

    #print(path)
    model = tf.keras.models.load_model(str(path),custom_objects={'f1_score':f1_score})

    predict=predcsv
    df=origcsv

    put=df.pop(str(output))
    print(predcsv)
    
    if output in predict:
        predict.pop(str(output))


    for i in range (len(columns)):
        print(i)
        print(encodings[i])
        print(columns[i])
        if(encodings[i]=='one hot'):
            predict=pd.get_dummies(predict,columns=[columns[i]])
        elif (encodings[i]=='label'):
            lb=LabelEncoder()
            predict[columns[i]]=lb.fit_transform(predict[str(columns[i])])
        elif (encodings[i]=='binary'):
            encoder=ce.BinaryEncoder(cols=[columns[i]])
            predict=encoder.fit_transform(predict)


    for i in range (len(num_cat)):
        predict[num_cat[i]]=pd.Categorical(predict[num_cat[i]])
    
    #print("prosao prvo")

    for i in range (len(columns)):
        print(i)
        print(encodings[i])
        print(columns[i])
        if(encodings[i]=='one hot'):
            #print("usao sam u prvi if")
            df=pd.get_dummies(df,columns=[columns[i]])
            #print("puko")
        elif (encodings[i]=='label'):
            lb=LabelEncoder()
            df[columns[i]]=lb.fit_transform(df[str(columns[i])])
        elif (encodings[i]=='binary'):
            encoder=ce.BinaryEncoder(cols=[columns[i]])
            df=encoder.fit_transform(df)


    for i in range (len(num_cat)):
        df[num_cat[i]]=pd.Categorical(df[num_cat[i]])

    #print("prosao drugo")
    ### gotovo enkodiranje

    
    print("PREDICT CSV")
    #print(predict)
    print("ORIGIN CSV")
    #print(df)

    result = pd.concat([df, predict], ignore_index=True, sort=False)

    print(result)

    result2=result[0:len(predict)]

    print(result2)

    if(type=="regression"):
        print("Usao sam u reg")
        scaler2=MinMaxScaler()
        result2=scaler2.fit_transform(result2)

        pred2 = model.predict(result2) 

        #put=pd.DataFrame(put)
        #put=scaler2.fit_transform(put)
        #put=scaler2.inverse_transform(put)

        #pred2=scaler2.inverse_transform(pred2)

        #pred=[]
        #for i in range (len(pred2)):
            #pred.append(pred2[i][0])

        #pred=np.array(pred)
        #pred=pred.tolist()
        #print(pred)
        #return pred

        pred2=np.array(pred2)
        pred2=pred2.tolist()
        print(pred2)
        return pred2



    else:
        print("Usao sam u klasifikacioni")
        scaler2=StandardScaler()
        result2=scaler2.fit_transform(result2)


        pred2 = model.predict(result2) 

        pred2 = np.argmax(pred2, axis = 1)

        pred2=np.array(pred2)
        pred2=pred2.tolist()

        print(pred2) 
        print("izlazim")
        return pred2
