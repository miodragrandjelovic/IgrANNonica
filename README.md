# Igrannonica

Projekat **Igrannonica** predstavlja igraliste za treniranje vestackih neuronskih mreza. Nas cilj je da korisniku omogucimo da na lak nacin izanaliziraju neki skup podataka.

# Potrebne tehnologije

Pre pokretanja aplikacje potrebno je proveriti da li na racunaru imate sledece tehnologije *(ako nemate,  klikom na link otvora vam se stranica koja pokazuje kako datu tehnologiju treba instalirati)*:

- [Angular](https://www.geeksforgeeks.org/angular-cli-angular-project-setup/) *(verzija 13 ili vise)*
  
- [.NET 6](https://docs.microsoft.com/en-us/dotnet/core/install/windows?tabs=net60)
  
- [Python](https://www.tutorialspoint.com/how-to-install-python-in-windows) ( biblioteka [Tensorflow](https://www.tensorflow.org/install/pip))

Naravno, potebni su i odgovarajuci editori. Za .NET koristiomo [Visual Studio](https://code.visualstudio.com/docs/setup/windows), a za Angular i Python [Visual Studo Code](https://docs.microsoft.com/en-us/visualstudio/install/install-visual-studio?view=vs-2022). 

# Pokretanje aplikacije

Prvo, projekat treba klonirati sa gitlab-a, kako bismo dobili ceo projeakt, pomocu komande i otvoriti odgovarajuci folder:

``` bash
    git clone http://gitlab.pmf.kg.ac.rs/igrannonica/revolutionn.git
    cd revolutionn
    cd src
```
Posto smo klonirali, u folderu **src** nalaze se 3 foldera i otvoramo svaki folder u odgovarajucem editoru:

- Backend ( .NET 6 )
- Frontend ( Angular )
- ML ( Python )


Otvaramo folder Frontend u Visual Stuio Code-u i otvorimo terminal u tom folderu.
Pre nego sto se pokrene ovaj deo, u komadnoj liniji treba da se izvrsi komanda 
```bash
    npm install
```
a zatim pokrecemo komandom:
```bash
    ng serve -open
```
i ovaj deo otvara se u pretrazivacu na adresi *http://localhost:4200/*.

Backend deo se otvara pomocu Visual Studio-a . Klikom na dugme za pokretanje projekat pokrecemo backend deo i on se otvara  u pretrazivacu na adresi *https://localhost:7167/swagger*.

Sto se tice Python dela, pored biblioteke **Tensorflow**, trebamo instalirati jos neke dodatne biblioteke koje su nam potrebne kao sto su: **flask, jsonify, request, pandas, numpy, sklearn,  keras, category_encoders, matplotlib** i to preko komadne linije pomocu komandi(*pip install naziv_biblioteke*): 
```python
    pip install flask
    pip install jsonify
    pip install request
    pip install pandas
    pip install numpy
    pip install sklearn
    pip install keras
    pip install keras
    pip install category_encoders
    pip install matplotlib 
```
Otvaramo folder ML u Visula Studio Code-u, i otvaramo fajl **Flask.py** i klikom da dugme Run Python File koji se nalasi u gornjem levom uglu pokrecemo ovaj deo.

I sada imamo pokrenut ceo projekat koji mozemo koristiti.
