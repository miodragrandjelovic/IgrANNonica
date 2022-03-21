from flask import Flask
from flask import jsonify,request
from itsdangerous import json
import pandas as pd

from ann.py import *

#from ann.linear import *

app = Flask(__name__)

#users=[{"FirstName": "petar", "LastName": "peric","Email": "e@gmail.com","Username": "pera", "Password": "sifra123"},
 #   {"FirstName": "mika", "LastName": "mikic","Email": "e@gmail.com","Username": "mika", "Password": "sifra123"},
  #  {"FirstName": "milan", "LastName": "milanic","Email": "e@gmail.com","Username": "milan", "Password": "sifra123"}]

hiperparametri=[{"EncodingType": "HotEncoding", "LearningRate": 0.03, "Activation": "Tanh", "Epoch": 3, "Layers": 1, "NeuronsLvl1": 1, "NeuronsLvl2": 1, "NeuronsLvl3": 1, "NeuronsLvl4": 1, "NeuronsLvl5": 1, "Ratio": 50, "BatchSize": 10, "Randomize": 1},
                {"EncodingType": "ColdEncoding", "LearningRate": 0.01, "Activation": "Tanko", "Epoch": 2, "Layers": 0, "NeuronsLvl1": 0, "NeuronsLvl2": 1, "NeuronsLvl3": 1, "NeuronsLvl4": 1, "NeuronsLvl5": 1,"Ratio": 30, "BatchSize": 9, "Randomize": 1}]

#json ne moze da procita jer su jednostruki navodnici, a ako se stave dvostruki kako da stavimo string izmedju jer string mora sa dvostrukim da krece i da se zavrsava?!
#csve = {"CsvData": "[{'PassengerId':1,'Survived':0,'Pclass':3,'Name':'Braund, Mr. Owen Harris','Sex':'male','Age':22,'SibSp':1,'Parch':0,'Ticket':'A/5 21171','Fare':7.25,'Cabin':'','Embarked':'S'},{'PassengerId':2,'Survived':1,'Pclass':1,'Name':'Cumings, Mrs. John Bradley (Florence Briggs Thayer)','Sex':'female','Age':38,'SibSp':1,'Parch':0,'Ticket':'PC 17599','Fare':71.2833,'Cabin':'C85','Embarked':C'}]"}
#csve = [{ "CsvData" : """[{"PassengerId":1,"Survived":0,"Pclass":3,"Name":"Braund, Mr. Owen Harris","Sex":"male","Age":22,"SibSp":1,"Parch":0,"Ticket":"A/5 21171","Fare":7.25,"Cabin":"","Embarked":"S"},{"PassengerId":2,"Survived":1,"Pclass":1,"Name":"Cumings, Mrs. John Bradley (Florence Briggs Thayer)","Sex":"female","Age":38,"SibSp":1,"Parch":0,"Ticket":"PC 17599","Fare":71.2833,"Cabin":"C85","Embarked":"C"}]"""}]
#csve = [{"EncodingType": "HotEncoding", "LearningRate": 0.03, "Activation": "Tanh", "Epoch": 3, "Layers": 1, "NeuronsLvl1": 1, "NeuronsLvl2": 1, "NeuronsLvl3": 1, "NeuronsLvl4": 1, "NeuronsLvl5": 1, "Ratio": 50, "BatchSize": 10, "Randomize": 1}]
#csve = [{"PassengerId":1,"Survived":0,"Pclass":3,"Name":"Braund, Mr. Owen Harris","Sex":"male","Age":22,"SibSp":1,"Parch":0,"Ticket":"A/5 21171","Fare":7.25,"Cabin":"","Embarked":"S"},{"PassengerId":2,"Survived":1,"Pclass":1,"Name":"Cumings, Mrs. John Bradley (Florence Briggs Thayer)","Sex":"female","Age":38,"SibSp":1,"Parch":0,"Ticket":"PC 17599","Fare":71.2833,"Cabin":"C85","Embarked":"C"}]
#@app.route("/users",methods=['POST'])
#def postAllUsers():
 #   users=request.get_json() 
#n = ""

"""
@app.route("/users", methods=["POST"]) #Primanje sa beka
def post_student():
    user = request.get_json()
    users.append(user)
    return users

@app.route("/users", methods=['GET']) #Slanje na bek
def  getAllUsers():
    return jsonify(users)

@app.route("/stat", methods=["POST"]) #Primanje Stats sa beka
def post_stat():
    stat = request.get_json()
    stats.append(stat)
    return stats

@app.route("/stat", methods=['GET']) #Slanje Stats na bek
def  getStat():
    return jsonify(stats)

"""

@app.route("/hp", methods=["POST"]) #Primanje HP sa beka
def post_hp():
    hp = request.get_json()
    hiperparametri.append(hp)
    return hiperparametri

@app.route("/hp", methods=['GET']) #Slanje HP na bek
def  getAllHps():
    return jsonify(hiperparametri)

@app.route("/csv", methods=["POST"]) #Primanje CSV sa beka i njegovo sredjivanje 
def post_csv():
    cs = request.get_json()
    data = pd.DataFrame.from_records(cs)
    #statistika=df.describe()
    #return statistika.to_json()
    for (columnName,columnData) in data.iteritems():
        if(data[str(columnName)][0].isnumeric()):
            #print(df[str(columnName)][0].isnumeric())
            data[str(columnName)]=data[str(columnName)].astype(float)

    global df
    df=data
    global csvdata
    csvdata = cs
    return csvdata

@app.route("/csv", methods=['GET']) #Slanje CSV na bek
def  getCsv():
    return jsonify(csvdata)

@app.route("/statistika",methods=['GET']) #statistika
def statistika():
    
    statistika=df.describe(include='all')
    statistika.rename(index={"25%":"Q1","50%":"Q2","75%":"Q3"},inplace=True)
    return statistika.to_json()


@app.route("/kor",methods=["GET"]) #slanje kor matrice na bek
def kor_matrica():
    return df.corr().to_json()


@app.route("/csv1",methods=['GET']) #Parsovanje u df
def treniraj():
    features = ['Pclass', 'Name', 'Sex', 'Age', 'SibSp', 'Parch', 'Ticket', 'Fare', 'Cabin', 'Embarked']
    history = create_model(type='regression',train=df,features=features, label="Survived",epochs=10, ratio=0.8, activation_function='sigmoid',hidden_layers_n=5, hidden_layer_neurons_list=[8,6,2,4,5],
        encode_type='label',randomize=True, batch_size=20, learning_rate=0.003, regularization=None, regularization_rate=0)
    return jsonify(history)
    




#if(__name__=="main"):
app.run(port = 3000)
