# ANN WORKER SENDS ALL THE PARAMETARS FOR NEURAL NETWORK TO PY FILE

#hiperparametri koje treba da prosledi bek

import pandas as pd
import py

type='classification' # or classification
activation_function = 'sigmoid' # relu, tanh, sigmoid, linear - currenty only working for sigmoid!!
learning_rate = 0.003 # 0.00001, 0.0001, 0.001, 0.003, 0.01, 0.03, 0.1, 0.3, 1, 3, 10
regularization = 'L1' # none, L1, L2
regularization_rate = 0.001 # 0, 0.001, 0.003, 0.01, 0.03, 0.1, 0.3, 1, 3, 10
encode_type = 'label' # onehot, label, ordinal
epochs = 10
randomize = False
ratio = 20
batch_size = 15


# fish.csv
#df = pd.read_csv('./src/ML/ann/data/reg/fish.csv')
#features = ['Species','Length1','Length2','Length3','Height','Width']
#label = 'Weight'


#df = pd.read_csv('./src/ML/ann/data/reg/fish.csv')
#features = ['Age', 'Sex', 'Ticket']
#label = 'Survived'


# insurance.csv
#df = pd.read_csv('./src/ML/ann/data/reg/insurance.csv')
#features = ['age','sex','bmi','children','smoker','region']
#label = 'charges'

# diamond
df = pd.read_csv('./src/ML/ann/data/class/diamonds.csv')
features = ['carat','color','clarity','depth','price','x','y','z']
label = 'cut'


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

stats = None
stats = py.Statistics(type)
stats.createModel(train=df,features=features, label=label, epochs=epochs, ratio=ratio, activation_function=activation_function,hidden_layers_n=5, hidden_layer_neurons_list=[8,6,2,4,5], encode_type=encode_type, randomize=randomize,
    batch_size=batch_size, learning_rate=learning_rate, regularization=regularization ,regularization_rate=regularization_rate)

print("The statistics are")
print(stats.stats)