# ANN WORKER SENDS ALL THE PARAMETARS FOR NEURAL NETWORK TO PY FILE

#hiperparametri koje treba da prosledi bek

import py

type='regression' # or classification
train = './src/ML/ann/train.csv'
activation_function = 'sigmoid' # relu, tahn, sigmoid, linear
learning_rate = '0.03' # 0.00001, 0.0001, 0.001, 0.003, 0.01, 0.03, 0.1, 0.3, 1, 3, 10
regularization = 'none' # none, L1, L2
regularization_rate = '0' # 0, 0.001, 0.003, 0.01, 0.03, 0.1, 0.3, 1, 3, 10
encode_type = 'ordinal' # onehot, label, ordinal
epochs = 12
randomize = True


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


history = py.create_model(type, train, label, epochs, training_test_ratio, activation_function, hidden_layers_n, hidden_layer_neurons, encode_type, randomize, batch_size, learning_rate)