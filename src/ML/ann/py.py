# PY FILE CALLS ALL THE STEPS FROM PROBLEM FILE THAT ARE NEEDED FOR NEURAL NETWORK


# problem anna je to sto moze da nauci bilo sta
# zato je potrebno zadati dobar filter algoritam
# tako da nam skloni sve one vrednosti kolona koje nam nisu  bitne za nasu predikciju

# takodje, treba obezbediti nacin enkodiranja kategorickih vrednosti

# mozemo podessiti dve vrste aktivacione funkcije
# prvo, aktivacionu funkciju za hidden layers
# zatim, aktivacionu funkciju za output layer


#import problem as pr
import ann.problem as pr

class Statistics():
    def __init__(self,type):
        self.type = type    
        self.stats = None

    def createModel(self,train, features, label, epochs, ratio, activation_function, hidden_layers_n, hidden_layer_neurons_list, encode_type,randomize, batch_size, learning_rate, regularization, regularization_rate):
        # model se kreira preko jedne fje, a u self.type se nalazi info da li treba da bude regresioni ili klasifikacioni
        """
        data=None
        data =pr.Data(train)
        data.load_data(label, features)
        data.clearupData(encode_type,self.type)
        data.splitData(label, ratio, randomize, activation_function)
        """

        data=None
        data=pr.Data(train)
        data.Misa(encode_type,self.type,features,label,ratio,randomize)


        model=None
        model =pr.Model(data,regularization, regularization_rate)
        model.makeModel(self.type, activation_function, hidden_layers_n, hidden_layer_neurons_list,regularization,regularization_rate)
        model.compileModel(self.type,learning_rate)
        model.trainModel(self.type,epochs,batch_size)
      #  model.plotResults(epochs, self.type)
        model.defMetrics(self.type)

        self.stats = model.hist
        
