# PY FILE CALLS ALL THE STEPS FROM LINEAR FILE THAT ARE NEEDED FOR NEURAL NETWORK


# problem anna je to sto moze da nauci bilo sta
# zato je potrebno zadati dobar filter algoritam
# tako da nam skloni sve one vrednosti kolona koje nam nisu  bitne za nasu predikciju

# takodje, treba obezbediti nacin enkodiranja kategorickih vrednosti

# mozemo podessiti dve vrste aktivacione funkcije
# prvo, aktivacionu funkciju za hidden layers
# zatim, aktivacionu funkciju za output layer


from matplotlib.pyplot import hist
#import linear as ln
import ann.linear as ln
import pandas as pd

class Statistics():
    def __init__(self,type):
        self.type = type
        self.stats = None

    def createLinear(self,train, features, label, epochs, ratio, activation_function, hidden_layers_n, hidden_layer_neurons_list, encode_type,randomize, batch_size, learning_rate, regularization, regularization_rate):
        data = ln.Data(train)
        data.load_data(label, features)
        data.clearupData(encode_type)
        data.splitData(label, ratio, randomize, activation_function)

        model = ln.Model(data,regularization, regularization_rate)
        model.makeModel(activation_function, hidden_layers_n, hidden_layer_neurons_list)
        model.compileModel(learning_rate)
        model.trainModel(epochs,batch_size)
        model.plotResults(epochs)
        model.defMetrics()

        self.stats = model.hist
        

    def createCategorical(self,train, features, label, epochs, ratio, activation_function, hidden_layers_n, hidden_layer_neurons_list, encode_type,randomize, batch_size, learning_rate, regularization, regularization_rate):
        pass

    def createModel(self,train, features, label, epochs, ratio, activation_function, hidden_layers_n, hidden_layer_neurons_list, encode_type,randomize, batch_size, learning_rate, regularization, regularization_rate):
        if (self.type == 'regression'):
            self.createLinear(train, features, label, epochs, ratio, activation_function, hidden_layers_n, hidden_layer_neurons_list, encode_type,randomize, batch_size, learning_rate, regularization, regularization_rate)
        elif (self.type == 'classification'):
            self.createCategorical(train, features, label, epochs, ratio, activation_function, hidden_layers_n, hidden_layer_neurons_list, encode_type,randomize, batch_size, learning_rate, regularization, regularization_rate)

