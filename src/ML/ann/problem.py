# LINEAR CONTAINS STEPS FROM CONSTRUCTING A NEURAL NETWORK
# ALL THE FUNCTIONS ARE CALLED FROM FUNCTIONS FILE

from numpy import float64
import ann.functions as fn
#import functions as fn
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
    

    def Misa(self, encode_type,type,features,label,ratio,randomize):

        self.data = fn.load_data(features, label, self.data)
        X, y = fn.feature_and_label(self.data, label)
        X=fn.encode_data(X, encode_type)
        y=pd.DataFrame(y)
        if (type == 'classification'):
            y=fn.encode_data(y, encode_type)


        # da se kolona iz object type kastuje u float
       # print("BEFORE CASTING")
       # print(y)
        y = y.astype(float64)
       # print("AFTER CASTING")
       # print(y)


        X=fn.normalize(X)
        y=fn.normalize(y)

        (self.X_train, self.X_test, self.y_train, self.y_test) = fn.split_data(X, y, ratio, randomize)




    def clearupData(self, encode_type,type):
        # deal with missing data
        # for numerical values fill with mean
        # for categorical values fill with mode 
      #  fn.missing_data(self.data)                                 ODKOMENTARISI POSLE
      """ 
        # drop the outliers from numerical columns
        #fn.drop_numerical_outliers(self.data)
        X, y = fn.feature_and_label(self.data, label)
        # encode data
        X=fn.encode_data(X, encode_type)
        y=pd.DataFrame(y)

        if(type="")

        self.data=fn.encode_data(self.data, encode_type)
        """ 
        
        # first take out the values that do not impact the model
#        fn.filter_data(self.data)

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

    def makeModel(self, type, activation_function, hidden_layers_n, hidden_layer_neurons_list,regularization,reg_rate):
        # make model
        # ako je regresioni problem , poziva se ova fja za kreiranje modela
       # if (type == 'regression'):
        self.model = fn.regression(self.data.X_train,self.data.y_train,hidden_layers_n, hidden_layer_neurons_list,activation_function,regularization,reg_rate)
        """
        # ako je klasifikacioni problem, imamo male izmene u kreiranju modela
        elif (type == 'classification'):
            pass
        """       
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
        self.hist['Loss'] = self.history.history['loss']
      #  self.hist['AUC'] = self.history.history['auc']
        self.hist['Precision'] = self.history.history['precision']
        self.hist['Recall'] = self.history.history['recall']
      #  self.hist['TruePositives'] = self.history.history['true_positives']
      #  self.hist['TrueNegatives'] = self.history.history['true_negatives']
      #  self.hist['FalsePositives'] = self.history.history['false_positives']
      #  self.hist['FalseNegatives'] = self.history.history['false_negatives']
      #  self.hist['TrueNegatives'] = self.history.history['true_negatives']
        self.hist['RMSE'] = self.history.history['root_mean_squared_error']

        self.hist['valLoss'] = self.history.history['val_loss']
        self.hist['valAccuracy'] = self.history.history['val_accuracy']
        self.hist['valMAE'] = self.history.history['val_mae']
        self.hist['valMSE'] = self.history.history['val_mse']
      #  self.hist['valAUC'] = self.history.history['val_auc']
        self.hist['valPrecision'] = self.history.history['val_precision']
        self.hist['valRecall'] = self.history.history['val_recall']
      #  self.hist['valTruePositives'] = self.history.history['val_true_positives']
      #  self.hist['valTrueNegatives'] = self.history.history['val_true_negatives']
      #  self.hist['valFalsePositives'] = self.history.history['val_false_positives']
      #  self.hist['valFalseNegatives'] = self.history.history['val_false_negatives']
      #  self.hist['valTrueNegatives'] = self.history.history['val_true_negatives']
        self.hist['valRMSE'] = self.history.history['val_root_mean_squared_error']

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

        plt.plot(epoch_range, self.history.history['mae'])
        plt.plot(epoch_range, self.history.history['val_mae'])
        plt.title("Model MAE")
        plt.ylabel("MAE")
        plt.xlabel("Epoch")
        plt.legend(['Train', 'Val'], loc='upper left')
        plt.show()

        plt.plot(epoch_range, self.history.history['mse'])
        plt.plot(epoch_range, self.history.history['val_mse'])
        plt.title("Model MSE")
        plt.ylabel("MSE")
        plt.xlabel("Epoch")
        plt.legend(['Train', 'Val'], loc='upper left')
        plt.show()

        plt.plot(epoch_range, self.history.history['precision'])
        plt.plot(epoch_range, self.history.history['val_precision'])
        plt.title("Model Precision")
        plt.ylabel("Precision")
        plt.xlabel("Epoch")
        plt.legend(['Train', 'Val'], loc='upper left')
        plt.show()

        plt.plot(epoch_range, self.history.history['recall'])
        plt.plot(epoch_range, self.history.history['val_recall'])
        plt.title("Model Recall")
        plt.ylabel("Recall")
        plt.xlabel("Epoch")
        plt.legend(['Train', 'Val'], loc='upper left')
        plt.show()

        plt.plot(epoch_range, self.history.history['true_positives'])
        plt.plot(epoch_range, self.history.history['val_true_positives'])
        plt.title("Model TP")
        plt.ylabel("TP")
        plt.xlabel("Epoch")
        plt.legend(['Train', 'Val'], loc='upper left')
        plt.show()

        plt.plot(epoch_range, self.history.history['true_negatives'])
        plt.plot(epoch_range, self.history.history['val_true_negatives'])
        plt.title("Model TN")
        plt.ylabel("TN")
        plt.xlabel("Epoch")
        plt.legend(['Train', 'Val'], loc='upper left')
        plt.show()

        plt.plot(epoch_range, self.history.history['false_positives'])
        plt.plot(epoch_range, self.history.history['val_false_positives'])
        plt.title("Model FP")
        plt.ylabel("FP")
        plt.xlabel("Epoch")
        plt.legend(['Train', 'Val'], loc='upper left')
        plt.show()

        plt.plot(epoch_range, self.history.history['false_negatives'])
        plt.plot(epoch_range, self.history.history['val_false_negatives'])
        plt.title("Model FN")
        plt.ylabel("FN")
        plt.xlabel("Epoch")
        plt.legend(['Train', 'Val'], loc='upper left')
        plt.show()

        plt.plot(epoch_range, self.history.history['root_mean_squared_error'])
        plt.plot(epoch_range, self.history.history['val_root_mean_squared_error'])
        plt.title("Model RMSE")
        plt.ylabel("RMSE")
        plt.xlabel("Epoch")
        plt.legend(['Train', 'Val'], loc='upper left')
        plt.show()



