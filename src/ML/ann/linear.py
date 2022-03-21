# LINEAR CONTAINS STEPS FROM CONSTRUCTING A NEURAL NETWORK
# ALL THE FUNCTIONS ARE CALLED FROM FUNCTIONS FILE

import ann.functions as fn
import matplotlib.pyplot as plt

def load_split_data(train_file, label , ratio,randomize, encode_type):
    # load all data
    data = fn.load_data(train_file)

    #print("before encoding")
    #print(data.head())
    #print(data.info)
    #print(data.dtypes)

    # deal with missing data
    data = fn.missing_data(data)
    
    # encode data
    data = fn.encode_data(data, encode_type)
    
    #print("after encoding")
    #print(data.head())

    # split x and y (features and label)
    X, y = fn.feature_and_label(data, label)

    # split test and train
    (X_train, X_test, y_train, y_test) = fn.split_data(X, y, ratio, randomize)
        
    # return the split data in the end
    return (X_train, X_test, y_train, y_test)
        
def clear_data(X_train, X_test, y_train,y_test):
    # first take out the values that do not impact the model
    (X_train, X_test) = fn.filter_data(X_train, X_test)

    # now, shape all data
    (X_train, X_test, y_train, y_test) = fn.scale_data(X_train, X_test, y_train, y_test)

    # return data
    return (X_train, X_test, y_train, y_test)

def make_model(epochs, X_train,X_test,y_train,y_test,hidden_layers_n,hidden_layer_neurons_list, activation_function, batch_size, learning_rate):
    # make model
    model = fn.regression(X_train,hidden_layers_n,hidden_layer_neurons_list,activation_function)

    #compile the model
    model = fn.compile_model(model, learning_rate)

    # train our model
    history = fn.train_model(model, X_train, y_train, epochs, batch_size, X_test, y_test)

    return history, model

def plot_result(history, epochs):
    # print("The test accuracy is {}, and loss is {}".format(history.history['accuracy'], history.history['loss']))
    epoch_range = range(1, epochs+1)
    plt.plot(epoch_range, history.history['accuracy'])
    plt.plot(epoch_range, history.history['val_accuracy'])
    plt.title("Model accuracy")
    plt.ylabel("Accuracy")
    plt.xlabel("Epoch")
    plt.legend(['Train', 'Val'], loc='upper left')
    plt.show()

    plt.plot(epoch_range, history.history['loss'])
    plt.plot(epoch_range, history.history['val_loss'])
    plt.title("Model loss")
    plt.ylabel("Loss")
    plt.xlabel("Epoch")
    plt.legend(['Train', 'Val'], loc='upper left')
    plt.show()

    plt.plot(epoch_range, history.history['auc'])
    plt.plot(epoch_range, history.history['val_auc'])
    plt.title("Model AUC")
    plt.ylabel("AUC")
    plt.xlabel("Epoch")
    plt.legend(['Train', 'Val'], loc='upper left')
    plt.show()


