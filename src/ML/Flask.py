from flask import Flask
from flask import jsonify,request

app = Flask(__name__)

@app.route("/users",methods=['POST'])
def postAllUsers():
    users=request.get_json() 
    return jsonify(users)

@app.route("/users", methods=['GET'])
def  getAllUsers():

    return jsonify([{"FirstName": "petar", "LastName": "peric","Username": "pera", "Password": "sifra123"},
    {"FirstName": "mika", "LastName": "mikic","Username": "mika", "Password": "sifra123"},
    {"FirstName": "milan", "LastName": "milanic","Username": "milan", "Password": "sifra123"}])


#if(__name__=="main"):
app.run(port = 3000)


#[{"FirstName": "petar", "LastName": "peric","Username": "pera", "Password": "sifra123"},
#    {"FirstName": "mika", "LastName": "mikic","Username": "mika", "Password": "sifra123"},
#    {"FirstName": "milan", "LastName": "milanic","Username": "milan", "Password": "sifra123"}]