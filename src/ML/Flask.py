from flask import Flask
from flask import jsonify,request

import pandas as pd

from ann.py import *

#from ann.linear import *



app = Flask(__name__)

#users=[{"FirstName": "petar", "LastName": "peric","Email": "e@gmail.com","Username": "pera", "Password": "sifra123"},
 #   {"FirstName": "mika", "LastName": "mikic","Email": "e@gmail.com","Username": "mika", "Password": "sifra123"},
  #  {"FirstName": "milan", "LastName": "milanic","Email": "e@gmail.com","Username": "milan", "Password": "sifra123"}]

#hiperparametri=[{"EncodingType": "HotEncoding", "LearningRate": 0.03, "Activation": "Tanh", "Epoch": 3, "Regularization":"None", "RegularizationRate":1, "ProblemType":"Classification", "Layers": 1, "NeuronsLvl1": 1, "NeuronsLvl2": 1, "NeuronsLvl3": 1, "NeuronsLvl4": 1, "NeuronsLvl5": 1, "Ratio": 50, "BatchSize": 10, "Randomize": True, "Inputs":"id,name,year", "Output":"health"},
#                {"EncodingType": "ColdEncoding", "LearningRate": 0.01, "Activation": "Tanko", "Epoch": 2,"Regularization":"None", "RegularizationRate":3, "ProblemType":"Classification","Layers": 0, "NeuronsLvl1": 0, "NeuronsLvl2": 1, "NeuronsLvl3": 1, "NeuronsLvl4": 1, "NeuronsLvl5": 1,"Ratio": 30, "BatchSize": 9, "Randomize": False, "Inputs":"lastname,year", "Output":"health"}]

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
   # hiperparametri.append(hp)
    global hiperp
    hiperp = hp
    return hp

@app.route("/hp", methods=['GET']) #Slanje HP na bek
def  getAllHps():
    return jsonify(hiperp)


def is_float(element) -> bool: ##fja za proveravanje da li je element tj string iz csva u stvari float
    try:
        float(element)
        return True
    except ValueError:
        return False

@app.route("/csv", methods=["POST"]) #Primanje CSV sa beka i njegovo sredjivanje 
def post_csv():
    cs = request.get_json()
    data = pd.DataFrame.from_records(cs)
    #statistika=df.describe()
    #return statistika.to_json()
    for (columnName,columnData) in data.iteritems():
        if(is_float(data[str(columnName)][0]) or data[str(columnName)][0].isnumeric()):
            data[str(columnName)]=data[str(columnName)].astype(float)

    global df
    df=data
    global csvdata
    csvdata = cs
    return csvdata

@app.route("/csv", methods=['GET']) #Slanje CSV na bek
def  getCsv():
    return jsonify(csvdata)


#

@app.route("/predictionCsv", methods=["POST"]) #Primanje CSV za predikciju sa beka i njegovo sredjivanje 
def post_predictioncsv():
    cs = request.get_json()
    return cs

@app.route("/prediction", methods=['GET']) #Slanje predikcije na bek
def  getPrediction():
    return jsonify(csvdata) #predikcija 

#

@app.route("/username", methods=["POST"]) #Primanje Username-a sa beka
def post_username():
    global username
    username = request.get_data()
    return username

@app.route("/username", methods=['GET']) #slanje Username-a na bek cisto za proveru
def getUsername():
    return username    


@app.route("/savedModel", methods=["POST"]) #Primanje savedModel-a sa beka
def post_savedModel():
    global savedModel
    savedModel = request.get_data()
    return savedModel

@app.route("/savedModel", methods=['GET']) #slanje savedModel-a na bek cisto za proveru
def getsavedModel():
    return savedModel    



@app.route("/stats",methods=['GET']) #statistika
def statistika(): 
    statistika=df.describe(include='all')
    statistika.rename(index={"25%":"Q1","50%":"Q2","75%":"Q3"},inplace=True)
    #return jsonify(statistika)
    return statistika.to_json()


@app.route("/kor",methods=["GET"]) #slanje kor matrice na bek
def kor_matrica():
    return df.corr().to_json()

@app.route("/model",methods=['GET']) #Parsovanje u df
def treniraj():
    # potrebne su i vrednosti tj kolone koje korisnik zeli da ukljuci iz dataseta
    
  # titanic.csv 
  #  features = ['Age', 'Sex', 'Ticket']
  # label = 'Survived'
    
  # fish.csv
  #  features = ['Species','Length1','Length2','Length3','Height','Width']
  #  label = 'Weight'
    
  #  insurance.csv
    
    x=hiperp['Inputs'].split(",")
    features = []
    for input in x:
        features.append(input)

    label = hiperp['Output']

    """
    features=['manufacturer','model','displ','year','cyl','trans','drv','cty','hwy']
    label='class'
    """

  #  churn
  #  features = ['CreditScore', 'Geography', 'Gender', 'Age','Tenure','Balance','NumOfProducts','HasCrCard','IsActiveMember','EstimatedSalary']
  #  label = 'Exited'

    # izmenjen nacin kreiranja i treniranja modela
    stats=None
    stats = Statistics(type=hiperp['ProblemType'])

    # ly ce biti lista broja neurona za svaki skriveni sloj koji je prosledjen
    ly = []
    for i in range(hiperp['Layers']):
        ly.append(hiperp['NeuronsLvl'+str(i+1)])
   # print("Hidden layer neurons are ", ly)
    
    stats.createModel(train=df,features=features, label=label, epochs=hiperp['Epoch'], ratio=hiperp['Ratio'], activation_function=hiperp['Activation'],hidden_layers_n=hiperp['Layers'], hidden_layer_neurons_list=ly, encode_type=hiperp['EncodingType'], randomize=hiperp['Randomize'],
        batch_size=hiperp['BatchSize'], learning_rate=hiperp['LearningRate'], regularization=hiperp['Regularization'] ,regularization_rate=hiperp['RegularizationRate'])

    # u objektu stats, u promenljivoj stats se nalaze statisticki podaci kroz epohe, u vidu dictionary-ja
    # npr. "Accuracy":[...]
    
    return jsonify(stats.stats)
    




#if(__name__=="main"):
app.run(port = 3000)
