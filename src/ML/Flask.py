
from flask import Flask
from flask import jsonify

app = Flask(__name__)

@app.route("/users", methods=['GET'])
def  getAllUsers():

    return jsonify([{"FirstName": "petar", "LastName": "peric","Username": "pera", "Password": "sifra123"},
    {"FirstName": "mika", "LastName": "mikic","Username": "mika", "Password": "sifra123"},
    {"FirstName": "milan", "LastName": "milanic","Username": "milan", "Password": "sifra123"}])

#if(__name__=="main"):
app.run(port = 3000)

