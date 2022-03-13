from flask import Flask
from flask import jsonify,request


app = Flask(__name__)

users=[{"FirstName": "petar", "LastName": "peric","Email": "e@gmail.com","Username": "pera", "Password": "sifra123"},
    {"FirstName": "mika", "LastName": "mikic","Email": "e@gmail.com","Username": "mika", "Password": "sifra123"},
    {"FirstName": "milan", "LastName": "milanic","Email": "e@gmail.com","Username": "milan", "Password": "sifra123"}]


#@app.route("/users",methods=['POST'])
#def postAllUsers():
 #   users=request.get_json() 

@app.route("/users", methods=["POST"])
def post_student():
    user = request.get_json()
    users.append(user)
    return users


@app.route("/users", methods=['GET'])
def  getAllUsers():
    return jsonify(users)


#if(__name__=="main"):
app.run(port = 3000)
