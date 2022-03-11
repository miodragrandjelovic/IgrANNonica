from flask import Flask, jsonify
import json
from json import JSONEncoder

app = Flask(name)

@app.route("/students", methods=['GET'])
def  getAllStudents():

    return jsonify([{"Ime": "lazar", "Indeks": "456"}, {"Ime": "lazar", "Indeks": "456"}, {"Ime": "lazar", "Indeks": "456"},])

if(name=="main"):
    app.run(port = 3000)