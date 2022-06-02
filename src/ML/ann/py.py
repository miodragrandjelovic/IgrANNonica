import ann.problem as pr

class Statistics():
    def __init__(self,type):
        self.type = type    
        self.stats = None

    def createModel(self,train,username, features, label, epochs, ratio, val_test, activation_function_list, hidden_layers_n, hidden_layer_neurons_list, columns,enc_types,num_cat_col,randomize, batch_size, learning_rate, regularization, regularization_rate, missing_values,path=None):

        data=None
        data=pr.Data(train)
        data.Misa(columns,enc_types,num_cat_col,self.type,features,label,ratio, val_test,randomize, missing_values)


        model=None
        model =pr.Model(data,regularization, regularization_rate)
        model.makeModel(self.type, activation_function_list, hidden_layers_n, hidden_layer_neurons_list,regularization,regularization_rate,username=username)
        model.compileModel(self.type,learning_rate)
        model.trainModel(self.type,epochs,batch_size,path)
        model.defMetrics(self.type)

        self.stats = model.hist
        
