# ANN WORKER SENDS ALL THE PARAMETARS FOR NEURAL NETWORK TO PY FILE

#hiperparametri koje treba da prosledi bek

import pandas as pd
import ann.py

#import ML.ann.py as pw
import ann.py as pw

type='regression' # or classification
train = './src/ML/ann/titanic.csv'
activation_function = 'linear' # relu, tanh, sigmoid, linear - currenty only working for sigmoid!!
learning_rate = '0.03' # 0.00001, 0.0001, 0.001, 0.003, 0.01, 0.03, 0.1, 0.3, 1, 3, 10
regularization = 'none' # none, L1, L2
regularization_rate = '0' # 0, 0.001, 0.003, 0.01, 0.03, 0.1, 0.3, 1, 3, 10
encode_type = 'label' # onehot, label, ordinal
epochs = 12
randomize = True


# number of hidden layers in ann
hidden_layers_n = 5
# number of neurons inside each of hidden layers
hidden_layer_neurons = [8,4,5,3,6]

# this ration can go from 10 to 90 percent
training_test_ratio = 0.2

# do we need it?
# noise can go from 0 to 50
noise = 0

# batch size can go from 1 to 30
batch_size = 15

# features are columns that user wants to include in this ann!!
features = ['Pclass', 'Name', 'Sex', 'Age', 'SibSp', 'Parch', 'Ticket', 'Fare', 'Cabin', 'Embarked']
#features = ['var3', 'var15', 'imp_ent_var16_ult1', 'imp_op_var39_comer_ult1', 'num_op_var39_hace2']


# output is the column that the user wants to predict with this model
label = 'Survived'

# we need to provide some loss/cost functions such as
# mean squared error
# mean absolute error
# hinge loss

df = pd.read_csv('./src/ML/ann/titanic.csv')

features = ['Pclass', 'Name', 'Sex', 'Age', 'SibSp', 'Parch', 'Ticket', 'Fare', 'Cabin', 'Embarked']
stats = pw.Statistics('regression')
stats.createModel(train=df,features=features, label='Survived', epochs=20, ratio=0.8, activation_function='sigmoid',hidden_layers_n=5, hidden_layer_neurons_list=[8,6,2,4,5], encode_type='label', randomize=True,
    batch_size=20, learning_rate=0.003, regularization='none' ,regularization_rate=0)

print("The statistics are")
print(stats.stats)