# PY FILE CALLS ALL THE STEPS FROM LINEAR FILE THAT ARE NEEDED FOR NEURAL NETWORK


# problem anna je to sto moze da nauci bilo sta
# zato je potrebno zadati dobar filter algoritam
# tako da nam skloni sve one vrednosti kolona koje nam nisu  bitne za nasu predikciju

# takodje, treba obezbediti nacin enkodiranja kategorickih vrednosti

# mozemo podessiti dve vrste aktivacione funkcije
# prvo, aktivacionu funkciju za hidden layers
# zatim, aktivacionu funkciju za output layer

import linear as ln

def create_model(type,train,test,label,epochs ,ratio, activation_function,input_layer_neurons, hidden_layers_n, hidden_layer_neurons_list, encode_type):
    # load data in suitable forms 
    (X_train, X_test, y_train, y_test, test_data) = ln.load_split_data(train, test, label, ratio)
    
    # after loading data, we need to transform it 
    (X_train, X_test, y_train, y_test) = ln.clear_data(X_train, X_test, y_train,y_test, encode_type)

    # making and training the model
    (history, model) = ln.make_model(epochs, X_train, X_test, y_train, y_test, input_layer_neurons, hidden_layers_n, hidden_layer_neurons_list, activation_function)

    # evaluating the model
    ln.plot_result(history, epochs)

    # return history to worker
    return history, test_data

