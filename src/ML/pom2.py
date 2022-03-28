import pandas as pd
from sklearn import metrics
import tensorflow as tf
from tensorflow import keras
from sklearn.model_selection import train_test_split
from pandas.api.types import is_string_dtype
from pandas.api.types import is_numeric_dtype
from keras import layers
from keras.losses import MeanSquaredError
from sklearn.preprocessing import LabelEncoder
import category_encoders as ce


df=pd.read_csv("src\ML\mpg.csv")

df.head(10)

pom=df.copy()

y = pom.pop("class")
y.columns = "class"

cat = pom.select_dtypes(include='O').keys()
pom=pd.get_dummies(pom,columns=cat)
pom
y=pd.Series(y)
y=pd.get_dummies(y)

for (columnName,columnData) in pom.iteritems():
    pom[str(columnName)]=columnData/columnData.max()