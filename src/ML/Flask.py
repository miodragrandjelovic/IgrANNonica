from flask import Flask
from flask import jsonify,request

import pandas as pd

from ann.py import *

import ann.prediction as pr

#from ann.linear import *



app = Flask(__name__)


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


#primanje csv-a za predikciju i posle slanje rezultata nazad

@app.route("/predictionCsv", methods=["POST"]) #Primanje CSV za predikciju sa beka i njegovo sredjivanje 
def post_predictioncsv():
    cs = request.get_json()
    data = pd.DataFrame.from_records(cs)
    for (columnName) in data.iteritems():
        if(is_float(data[str(columnName)][0]) or data[str(columnName)][0].isnumeric()):
            data[str(columnName)]=data[str(columnName)].astype(float)

    global predictdf
    predictdf=data
    return predictdf.to_json()

@app.route("/prediction", methods=['GET']) #Slanje predikcije na bek
def  getPrediction():
    return pr.predikcija(savedModel,predictdf)

#

@app.route("/username", methods=["POST"]) #Primanje Username-a sa beka
def post_username():
    global username
    username = request.get_data()
    return username

@app.route("/username", methods=['GET']) #slanje Username-a na bek cisto za proveru
def getUsername():
    return username    


@app.route("/savedModel", methods=["POST"]) #Primanje putanje do foldera savedModel-a izabranog 
def post_savedModel():
    global savedModel
    savedModel = request.get_data()
    return savedModel

@app.route("/savedModel", methods=['GET']) #slanje savedModel-a na bek cisto za proveru
def getsavedModel():
    return savedModel    

@app.route("/pathModel", methods=["POST"]) #Primanje putanje do foldera novog modela
def post_pathmodel():
    global pathmodel
    pathmodel = request.get_data()
    return pathmodel

@app.route("/pathModel", methods=['GET']) #slanje putanje do foldera novog modelas na bek cisto za proveru
def getpathmodel():
    return pathmodel    


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
 
    
    x=hiperp['Inputs'].split(",")
    features = []
    for input in x:
        features.append(input)

    label = hiperp['Output']


    # izmenjen nacin kreiranja i treniranja modela
    stats=None
    stats = Statistics(type=hiperp['ProblemType'])

    # ly ce biti lista broja neurona za svaki skriveni sloj koji je prosledjen
    ly = []
    for i in range(hiperp['Layers']):
        ly.append(hiperp['NeuronsLvl'+str(i+1)])
   # print("Hidden layer neurons are ", ly)
    
    stats.createModel(train=df,features=features, label=label, epochs=hiperp['Epoch'], ratio=hiperp['Ratio'], activation_function=hiperp['Activation'],hidden_layers_n=hiperp['Layers'], hidden_layer_neurons_list=ly, encode_type=hiperp['EncodingType'], randomize=hiperp['Randomize'],
        batch_size=hiperp['BatchSize'], learning_rate=hiperp['LearningRate'], regularization=hiperp['Regularization'] ,regularization_rate=hiperp['RegularizationRate'],path=pathmodel)

    # u objektu stats, u promenljivoj stats se nalaze statisticki podaci kroz epohe, u vidu dictionary-ja
    # npr. "Accuracy":[...]
    
    return jsonify(stats.stats)
    

#if(__name__=="main"):
app.run(port = 3000)
