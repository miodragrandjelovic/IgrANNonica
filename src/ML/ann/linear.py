# LINEAR CONTAINS STEPS FROM CONSTRUCTING A NEURAL NETWORK
# ALL THE FUNCTIONS ARE CALLED FROM FUNCTIONS FILE

import ann.functions as fn
#import functions as fn
#import ann.functions as fn
import pandas as pd
import matplotlib.pyplot as plt

class Data():
    def __init__(self, train_file):
        self.data = train_file
        self.X_train=None
        self.X_test=None
        self.y_train=None
        self.y_test=None
        
    def load_data(self, label, features):
        self.data = fn.load_data(features, label, self.data)
    
    def clearupData(self, encode_type):
        # deal with missing data
        # for numerical values fill with mean
        # for categorical values fill with mode 
        fn.missing_data(self.data)
        
        # drop the outliers from numerical columns
        #fn.drop_numerical_outliers(self.data)

        # encode data
        fn.encode_data(self.data, encode_type)

        # first take out the values that do not impact the model
        fn.filter_data(self.data)

    def splitData(self, label, ratio, randomize, activation_function):
        
        self.data=fn.normalize(self.data)
        
        # split x and y (features and label)
        X, y = fn.feature_and_label(self.data, label)

        # according to activation function, normalize y set
        #y = fn.normalize(y, activation_function)

        # split test and train data 
        (self.X_train, self.X_test, self.y_train, self.y_test) = fn.split_data(X, y, ratio, randomize)

        # now, shape all data
        #fn.scale_data(self.X_train, self.X_test, self.y_train, self.y_test)


class Model():
    def __init__(self, data, regularization, regularization_rate):
        self.data = data
        self.model = None
        self.history = None
        self.hist = None
        self.regularization = regularization
        self.regularization_rate = regularization_rate

    def makeModel(self, activation_function, hidden_layers_n, hidden_layer_neurons_list,regularization,reg_rate):
        # make model
        self.model = fn.regression(self.data.X_train,hidden_layers_n, hidden_layer_neurons_list,activation_function,regularization,reg_rate)

    def compileModel(self, learning_rate):
        #compile the model
        fn.compile_model(self.model, learning_rate)

    def trainModel(self,epochs, batch_size):
        # train our model
        self.history = fn.train_model(self.model, self.data.X_train, self.data.y_train, epochs, batch_size, self.data.X_test, self.data.y_test)

    def defMetrics(self):
        #print("HISTORY OF TRAINING")
        #print(history)

        self.hist = dict()
            
        self.hist['Accuracy'] = self.history.history['accuracy']
        self.hist['MAE'] = self.history.history['mae']
        self.hist['MSE'] = self.history.history['mse']
        #self.hist['AUC'] = self.history.history['auc']
        self.hist['Loss'] = self.history.history['loss']

    def plotResults(self, epochs):
        # print("The test accuracy is {}, and loss is {}".format(history.history['accuracy'], history.history['loss']))
        epoch_range = range(1, epochs+1)
        plt.plot(epoch_range, self.history.history['accuracy'])
        plt.plot(epoch_range, self.history.history['val_accuracy'])
        plt.title("Model accuracy")
        plt.ylabel("Accuracy")
        plt.xlabel("Epoch")
        plt.legend(['Train', 'Val'], loc='upper left')
        plt.show()

        plt.plot(epoch_range, self.history.history['loss'])
        plt.plot(epoch_range, self.history.history['val_loss'])
        plt.title("Model loss")
        plt.ylabel("Loss")
        plt.xlabel("Epoch")
        plt.legend(['Train', 'Val'], loc='upper left')
        plt.show()

        plt.plot(epoch_range, self.history.history['auc'])
        plt.plot(epoch_range, self.history.history['val_auc'])
        plt.title("Model AUC")
        plt.ylabel("AUC")
        plt.xlabel("Epoch")
        plt.legend(['Train', 'Val'], loc='upper left')
        plt.show()



