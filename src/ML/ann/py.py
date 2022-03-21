# PY FILE CALLS ALL THE STEPS FROM LINEAR FILE THAT ARE NEEDED FOR NEURAL NETWORK


# problem anna je to sto moze da nauci bilo sta
# zato je potrebno zadati dobar filter algoritam
# tako da nam skloni sve one vrednosti kolona koje nam nisu  bitne za nasu predikciju

# takodje, treba obezbediti nacin enkodiranja kategorickih vrednosti

# mozemo podessiti dve vrste aktivacione funkcije
# prvo, aktivacionu funkciju za hidden layers
# zatim, aktivacionu funkciju za output layer

import ann.linear as ln

def create_model(type,train,label,epochs ,ratio, activation_function, hidden_layers_n, hidden_layer_neurons_list, encode_type,randomize, batch_size, learning_rate):
    # load data in suitable forms 
    (X_train, X_test, y_train, y_test) = ln.load_split_data(train, label, ratio, randomize, encode_type)
    
    # after loading data, we need to transform it 
    (X_train, X_test, y_train, y_test) = ln.clear_data(X_train, X_test, y_train,y_test)

    # making and training the model
    (history, model) = ln.make_model(epochs, X_train, X_test, y_train, y_test, hidden_layers_n, hidden_layer_neurons_list, activation_function, batch_size, learning_rate)


    # evaluating the model
    #(test_loss, test_acc) = model.evaluate(X_test, y_test)
    #print("THE MODEL WE'VE TRAINED:")
    #print("LOSS: ",test_loss," ACCURACY: ",test_acc)
    
    ln.plot_result(history, epochs)

    # return history to worker
    return history

