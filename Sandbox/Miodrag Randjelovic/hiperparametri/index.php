<html>
    <head>
        <meta charset="UTF-8">
        <title></title>
    </head>
    <body>
        
        <form>
            Broj slojeva: <input id="layers" name="layers" type="number"  min="1" max="5" onchange="Function()"> <br> <br>
        
        <div id="forEveryLayer">
            
        </div> <br>
        
        <input type="submit">
        
        </form>
        
       
    </body>
    
    <script>
    
    
    function Function()
    {
        var n=document.getElementById("layers").value;
        
        var tekst="";
        
        for(var i=0;i<n;i++)
        {
            tekst+=" Sloj "+(i+1)+" <input type='text' name='layer"+(i+1)+"'> <br>"
        }
        
        document.getElementById("forEveryLayer").innerHTML=tekst;
    }
    
    
    </script>
    
    
</html>
