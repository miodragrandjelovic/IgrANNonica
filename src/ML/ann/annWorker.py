# ANN WORKER SENDS ALL THE PARAMETARS FOR NEURAL NETWORK TO PY FILE

#hiperparametri koje treba da prosledi bek

import py

type='regression' # or classification
train = './src/ML/ann/train.csv'
activation_function = 'sigmoid'
learning_rate = '0.03'
regularization = 'None'
regularization_rate = '0'
encode_type = 'onehot'
epochs = 12
randomize = True


# number of layers in input layer of neural network
input_layer_neurons = 32
# number of hidden layers in ann
hidden_layers_n = 5
# number of neurons inside each of hidden layers
hidden_layer_neurons = [50,50,50,50,50]

# this ration can go from 10 to 90 percent
training_test_ratio = 0.9

# noise can go from 0 to 50
noise = 0

# batch size can go from 1 to 30
batch_size = 10

# features are columns that user wants to include in this ann!!
features = ''

# output is the column that the user wants to predict with this model
label = 'TARGET'

# we need to provide some loss/cost functions such as
# mean squared error
# mean absolute error
# hinge loss


history = py.create_model(type, train, label, epochs, training_test_ratio, activation_function, input_layer_neurons, hidden_layers_n, hidden_layer_neurons, encode_type, randomize, batch_size)