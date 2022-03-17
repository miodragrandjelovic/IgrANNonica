from flask import Flask
from flask import jsonify,request


app = Flask(__name__)

users=[{"FirstName": "petar", "LastName": "peric","Email": "e@gmail.com","Username": "pera", "Password": "sifra123"},
    {"FirstName": "mika", "LastName": "mikic","Email": "e@gmail.com","Username": "mika", "Password": "sifra123"},
    {"FirstName": "milan", "LastName": "milanic","Email": "e@gmail.com","Username": "milan", "Password": "sifra123"}]

hiperparametri=[{"EncodingType": "HotEncoding", "LearningRate": 0.03, "Activation": "Tanh", "Epoch": 3, "Layers": 1, "NeuronsLvl1": 1, "NeuronsLvl2": 1, "NeuronsLvl3": 1, "NeuronsLvl4": 1, "NeuronsLvl5": 1, "Ratio": 50, "BatchSize": 10, "Randomize": 1},
                {"EncodingType": "ColdEncoding", "LearningRate": 0.01, "Activation": "Tanko", "Epoch": 2, "Layers": 0, "NeuronsLvl1": 0, "NeuronsLvl2": 1, "NeuronsLvl3": 1, "NeuronsLvl4": 1, "NeuronsLvl5": 1,"Ratio": 30, "BatchSize": 9, "Randomize": 1}]

#json ne moze da procita jer su jednostruki navodnici, a ako se stave dvostruki kako da stavimo string izmedju jer string mora sa dvostrukim da krece i da se zavrsava?!
#csve = {"CsvData": "[{'PassengerId':1,'Survived':0,'Pclass':3,'Name':'Braund, Mr. Owen Harris','Sex':'male','Age':22,'SibSp':1,'Parch':0,'Ticket':'A/5 21171','Fare':7.25,'Cabin':'','Embarked':'S'},{'PassengerId':2,'Survived':1,'Pclass':1,'Name':'Cumings, Mrs. John Bradley (Florence Briggs Thayer)','Sex':'female','Age':38,'SibSp':1,'Parch':0,'Ticket':'PC 17599','Fare':71.2833,'Cabin':'C85','Embarked':C'}]"}
#csve = [{ "CsvData" : """[{"PassengerId":1,"Survived":0,"Pclass":3,"Name":"Braund, Mr. Owen Harris","Sex":"male","Age":22,"SibSp":1,"Parch":0,"Ticket":"A/5 21171","Fare":7.25,"Cabin":"","Embarked":"S"},{"PassengerId":2,"Survived":1,"Pclass":1,"Name":"Cumings, Mrs. John Bradley (Florence Briggs Thayer)","Sex":"female","Age":38,"SibSp":1,"Parch":0,"Ticket":"PC 17599","Fare":71.2833,"Cabin":"C85","Embarked":"C"}]"""}]
#csve = [{"EncodingType": "HotEncoding", "LearningRate": 0.03, "Activation": "Tanh", "Epoch": 3, "Layers": 1, "NeuronsLvl1": 1, "NeuronsLvl2": 1, "NeuronsLvl3": 1, "NeuronsLvl4": 1, "NeuronsLvl5": 1, "Ratio": 50, "BatchSize": 10, "Randomize": 1}]
csve = [{"PassengerId":1,"Survived":0,"Pclass":3,"Name":"Braund, Mr. Owen Harris","Sex":"male","Age":22,"SibSp":1,"Parch":0,"Ticket":"A/5 21171","Fare":7.25,"Cabin":"","Embarked":"S"},{"PassengerId":2,"Survived":1,"Pclass":1,"Name":"Cumings, Mrs. John Bradley (Florence Briggs Thayer)","Sex":"female","Age":38,"SibSp":1,"Parch":0,"Ticket":"PC 17599","Fare":71.2833,"Cabin":"C85","Embarked":"C"}]
#@app.route("/users",methods=['POST'])
#def postAllUsers():
 #   users=request.get_json() 
#n = ""
@app.route("/users", methods=["POST"]) #Primanje sa beka
def post_student():
    user = request.get_json()
    users.append(user)
    return users

@app.route("/users", methods=['GET']) #Slanje na bek
def  getAllUsers():
    return jsonify(users)

@app.route("/hp", methods=["POST"]) #Primanje HP sa beka
def post_hp():
    hp = request.get_json()
    hiperparametri.append(hp)
    return hiperparametri

@app.route("/hp", methods=['GET']) #Slanje HP na bek
def  getAllHps():
    return jsonify(hiperparametri)

@app.route("/csv", methods=["POST"]) #Primanje CSV sa beka
def post_csv():
    cs = request.get_json()
    global csvdata
    csvdata = cs
    return csvdata

@app.route("/csv", methods=['GET']) #Slanje CSV na bek
def  getCsv():
    return jsonify(csvdata)


#if(__name__=="main"):
app.run(port = 3000)
