# ANN WORKER SENDS ALL THE PARAMETARS FOR NEURAL NETWORK TO PY FILE

#hiperparametri koje treba da prosledi bek

import pandas as pd
import py

#import ML.ann.py as pw
import py as pw

type='regression' # or classification
activation_function = 'linear' # relu, tanh, sigmoid, linear - currenty only working for sigmoid!!
learning_rate = '0.03' # 0.00001, 0.0001, 0.001, 0.003, 0.01, 0.03, 0.1, 0.3, 1, 3, 10
regularization = 'none' # none, L1, L2
regularization_rate = '0' # 0, 0.001, 0.003, 0.01, 0.03, 0.1, 0.3, 1, 3, 10
encode_type = 'label' # onehot, label, ordinal
epochs = 12
randomize = True

"""
# fish.csv
df = pd.read_csv('./src/ML/ann/data/reg/fish.csv')

#features = ['Species','Length1','Length2','Length3','Height','Width']
features = ['Length1']
label = 'Weight'
"""

df = pd.read_csv('./src/ML/ann/data/class/titanic.csv')
features = ['Age', 'Sex', 'Ticket']
label = 'Survived'


"""
# insurance.csv
df = pd.read_csv('./src/ML/ann/data/reg/insurance.csv')
features = ['age','sex','bmi','children','smoker','region']
label = 'charges'
"""


"""
# realestate
df = pd.read_csv('./src/ML/ann/data/reg/realestate.csv')
features = ['transaction_date','house_age','distance_MRT','convenience_stores','latitude','longitude']
label = 'unit_price'
"""

# we need to provide some loss/cost functions such as
# mean squared error
# mean absolute error
# hinge loss

stats = pw.Statistics('regression')
stats.createModel(train=df,features=features, label=label, epochs=15, ratio=0.8, activation_function='relu',hidden_layers_n=5, hidden_layer_neurons_list=[8,6,2,4,5], encode_type='label', randomize=True,
    batch_size=20, learning_rate=0.003, regularization='none' ,regularization_rate=0)

print("The statistics are")
print(stats.stats)