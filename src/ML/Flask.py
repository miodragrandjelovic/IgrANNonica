from doctest import DONT_ACCEPT_TRUE_FOR_1
from flask import Flask
from flask import jsonify,request

import pandas as pd

from ann.py import *

import ann.prediction as pr
from ann.functions import save_model

#from ann.linear import *



app = Flask(__name__)


@app.route("/hp", methods=["POST"]) #Primanje HP sa beka
def post_hp():
    hp = request.get_json()
   # hiperparametri.append(hp)
    global hiperp
    hiperp = hp
    return jsonify(hp)

@app.route("/hp", methods=['GET']) #Slanje HP na bek
def  getAllHps():
    return jsonify(hiperp)


@app.route("/predictionHp", methods=["POST"]) #Primanje HP za predikciju sa beka
def post_hppred():
    hp = request.get_json()
   # hiperparametri.append(hp)
    global hiperp1
    hiperp1 = hp
    return jsonify(hp)

@app.route("/predictionHp", methods=['GET']) #Slanje HP za predikciju na bek
def  getAllHpspred():
    return jsonify(hiperp1)

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
    return jsonify(csvdata)

@app.route("/csv", methods=['GET']) #Slanje CSV na bek
def  getCsv():
    return jsonify(csvdata)


@app.route("/predictionCsv", methods=["POST"]) #Primanje predictionCSV sa beka i njegovo sredjivanje 
def post_predictioncsv():
    cs = request.get_json()
    data = pd.DataFrame.from_records(cs)
    #statistika=df.describe()
    #return statistika.to_json()
    for (columnName,columnData) in data.iteritems():
        if(is_float(data[str(columnName)][0]) or data[str(columnName)][0].isnumeric()):
            data[str(columnName)]=data[str(columnName)].astype(float)

    global predictiondf
    predictiondf=data
    global predictioncsvdata
    predictioncsvdata = cs
    return jsonify(predictioncsvdata)

@app.route("/predictionCsv", methods=['GET']) #Slanje predictionCSV na bek
def  getpredictionCsv():
    return jsonify(predictioncsvdata)


@app.route("/predictionCsvOriginal", methods=["POST"]) #Primanje originalnog CSV-a za predikciju sa beka i njegovo sredjivanje 
def post_csvoriginal():
    cs = request.get_json()
    data = pd.DataFrame.from_records(cs)
    #statistika=df.describe()
    #return statistika.to_json()
    for (columnName,columnData) in data.iteritems():
        if(is_float(data[str(columnName)][0]) or data[str(columnName)][0].isnumeric()):
            data[str(columnName)]=data[str(columnName)].astype(float)

    global originaldf
    originaldf=data
    global originalcsvdata
    originalcsvdata = cs
    return jsonify(originalcsvdata)

@app.route("/predictionCsvOriginal", methods=['GET']) #Slanje originalnog CSV-a za predikciju na bek
def  getCsvoriginal():
    return jsonify(originalcsvdata)

@app.route("/pathModel", methods=["POST"]) #Primanje putanje do foldera novog modela
def post_pathmodel():
    global pathmodel
    path=request.get_data()
    raw_string = r"{}".format(path)
    raw_string=raw_string[2:-1]
    pathmodel=raw_string
    return pathmodel

@app.route("/pathModel", methods=['GET']) #slanje putanje do foldera novog modelas na bek cisto za proveru
def getpathmodel():
    return pathmodel    

@app.route("/prediction",methods=["GET"]) #slanje rezultata predikcije na bek!
def predikcija_def():
    
    df1=pd.DataFrame.from_records(hiperp1)
    print(df1)
    print(df1["ColumNames"])
    print(df1['Encodings'])
    print(df1['CatNum'])

    type=df1['ProblemType'][0]
    print(type)

    pom=df1['ColumNames']
    columns = []
    for value in pom:
        if(value!=None):
            columns.append(value)
    print(columns)


    pom=df1['Encodings']
    encodings = []
    for value in pom:
        if(value!=None):
            encodings.append(value)
    print(encodings)

    pom=df1['CatNum']
    num_cat = []
    for value in pom:
        if(value!=None):
            num_cat.append(value)
    print(num_cat)

    output=df1["Output"][0]
    print(output)
    pred=pr.predikcija(path=pathmodel,origcsv=originaldf,predcsv=predictiondf,type=type,columns=columns,encodings=encodings,num_cat=num_cat,output=output)

    return jsonify(pred)




@app.route("/username", methods=["POST"]) #Primanje Username-a sa beka
def post_username():
    global username
    pom = request.get_data()
    raw_string = r"{}".format(pom)
    raw_string=raw_string[2:-1]
    username=raw_string
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



@app.route("/stats",methods=['GET']) #statistika
def statistika(): 
    statistika=df.describe(include='all')
    statistika.rename(index={"25%":"Q1","50%":"Q2","75%":"Q3"},inplace=True)
    #return jsonify(statistika)
    return statistika.to_json()


@app.route("/kor",methods=["GET"]) #slanje kor matrice na bek
def kor_matrica():
    return df.corr().to_json()


@app.route("/savemodel",methods=["POST"]) #cuvanje modela
def save_model1():
    path=request.get_data()
    raw_string = r"{}".format(path)
    raw_string=raw_string[2:-1]
    pathmodel1=raw_string
    #print(pathmodel1)
    save_model(pathmodel1,username)
    return pathmodel1


@app.route("/model",methods=['GET']) #Parsovanje u df
def treniraj():
 
    print(hiperp)
    x=hiperp['Inputs'].split(",")
    features = []
    for input in x:
        features.append(input)

    label = hiperp['Output']


    # izmenjen nacin kreiranja i treniranja modela
    stats=None
    stats = Statistics(type=hiperp['ProblemType'])

    # ly ce biti lista broja neurona za svaki skriveni sloj koji je prosledjen
  #  ly = []
   # for i in range(hiperp['Layers']):
    #    ly.append(hiperp['NeuronsLvl'+str(i+1)])
   # print("Hidden layer neurons are ", ly)

    #try:
        #pathmodel
    #except NameError:
        #print("well, it WASN'T defined after all!")
        #pathmodel=None

    #finally:
    
    pathmodel=None
    stats.createModel(train=df,username=hiperp['Username'],features=features, label=label, epochs=hiperp['Epoch'], ratio=hiperp['Ratio'],val_test=hiperp['ValAndTest'], activation_function_list=hiperp['ActivationFunctions'],hidden_layers_n=hiperp['Layers'],
        hidden_layer_neurons_list=hiperp['NumberOfNeurons'], columns=hiperp['ColumNames'],enc_types=hiperp['Encodings'],num_cat_col=hiperp['CatNum'], randomize=hiperp['Randomize'],
        batch_size=hiperp['BatchSize'], learning_rate=hiperp['LearningRate'], regularization=hiperp['Regularization'] ,regularization_rate=hiperp['RegularizationRate'], missing_values=hiperp['MissingValues'],path=pathmodel)

    # u objektu stats, u promenljivoj stats se nalaze statisticki podaci kroz epohe, u vidu dictionary-ja
    # npr. "Accuracy":[...]
    
    return jsonify(stats.stats)

#@app.route("/prediction", methods=['GET']) #Slanje predikcije na bek
#def  getPrediction():
#    return pr.predikcija(path,origcsv,predcsv,type,columns,encodings,num_cat,output)   ### odkomentarisati kad se odradi na frontu i backu

#if(__name__=="main"):
app.run(port = 3000)
