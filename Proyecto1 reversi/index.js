const express = require('express');
const app  = express();

const heuristica = [[120,-20,20,5,5,20,-20,120],
                  [-20,-40,-5,-5,-5,-5,-40,-20],
                  [20,-5,15,3,3,15,-5,20],
                  [5,-5,3,3,3,3,-5,5],
                  [5,-5,3,3,3,3,-5,5],
                  [20,-5,15,3,3,15,-5,20],
                  [-20,-40,-5,-5,-5,-5,-40,-20],
                  [120,-20,20,5,5,20,-20,120]];

const mejores = [0, 55, 56, 57, 58, 59, 60, 61, 62, 63];


var oponente;

app.listen(process.env.PORT || 3000, () =>{
    console.log('Reversi inicializado - 201408470');
});

app.get('/', (req, res)=>{
     
    //se obtienen los headers del url
    let obtenerheaders = new URLSearchParams(req.url.substring(1));
    const turno = obtenerheaders.get("turno");
    const estado = obtenerheaders.get("estado");
    console.log(turno);
    console.log(estado);

    //reconozco quien sera el oponente
    if(turno == 0){
        oponente = 1;
    }else{
        oponente = 0;
    }

    var vector = Array.from(estado).map(Number);
    var tablero = llenarTablero(vector);

    let pos = jugar(tablero,turno,6,heuristica);

    let numero = pos[0] + "" +pos[1];
    //se envia a imprimir el numero en la pagina
    res.send(numero);
     
});

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function jugar(tablero, turno, profundidad, heuristica){
    nodos = 0;
    let cont = -2147483648;
    let mejor_pos = null;

    //let movimientos = posibles_movimientos(tablero,turno);

    for(let pos of posibles_movimientos(tablero,turno)){
        console.log("pos", pos);
        //---jugar hasta aqui funciona bien
        //let rand = getRandomInt(0, movimientos.length-1);
        //console.log("le", movimientos.length);
        
        let nuevo = nuevo_tablero(tablero,pos, turno);
        let min = -2147483648;
        let max = 2147483647;
        let cont2 = MINIMAX(nuevo, turno, profundidad-1, false, min, max, heuristica);

        if(cont2 != null && cont2 > cont ){
            cont = cont2;
            mejor_pos = pos;
        }
        //return mejor_pos;
        //return pos;
        //return movimientos[rand];
    }
    
    nodos = 0;
    let mejor_punteo = -2147483648;
    let mejor_movimiento = null;

    let movimientos = posibles_movimientos(tablero,turno);

    let rand = getRandomInt(0, movimientos.length);
    console.log("le", movimientos.length);
    return movimientos[rand];


    

    /*for(let pos of posibles_movimientos(tablero,turno)){
        console.log("pos", pos);
        //---jugar hasta aqui funciona bien
        return pos;
        
    }*/
}

function MINIMAX(nuevotab, turno, profundidad, bandera, a, b, heuristica){
    nodos= nodos + 1;
    
    if(profundidad == 0 || sinmovimientos(nuevotab)){
        //return valor heuristica 
        return null;
    }

    if(bandera && !tienemovimientos(nuevotab, turno) || (!bandera && !tienemovimientos(nuevotab,((turno==0) ? 1 : 0)))){
        return MINIMAX(nuevotab,turno, profundidad-1,!bandera,a,b,heuristica);
    }

    let cont;

    if(bandera){
        //MAX
        cont = -2147483648;

        for(let pos of posibles_movimientos(nuevotab,turno)){
            
            let nuevo = nuevo_tablero(nuevotab, pos,turno);

            //se realiza una llamada recursiva 
            let cont2 = MINIMAX(nuevo, turno, profundidad-1,false,a,b, heuristica);
            
            if(cont2 > cont){
                cont = cont2;
            }

            if(cont > a){
                a = cont;
            }

            if(b <= a){
                break;
            }
        }
    }else{
        //MIN
        cont = 2147483647;

        for(let pos of posibles_movimientos(nuevotab, ((turno==0) ? 1 : 0))){
            let nuevo = nuevo_tablero(nuevotab, pos, ((turno==0) ? 1 : 0));

            let cont2 = MINIMAX(nuevo, turno, profundidad-1, true, a, b, heuristica);

            if(cont2 < cont){
                cont = cont2;
            }

            if(cont < b){
                b = cont;
            }
            
            if(b <= a){
                break;
            }
        }
    }
    return cont;
}

function sinmovimientos(tablero){
    return !(tienemovimientos(tablero,0) || tienemovimientos(tablero,1));
}

function tienemovimientos(tablero, turno){
    return posibles_movimientos(tablero, turno).length >0;
}

function espacios_ocupados(tablero){
    let cont = 0;
    for(let i=0; i<8; i++){
        for(let j=0; j<8; j++){
            if(tablero[i][j] != 2){
                cont = cont + 1;
            }
        }
    }
    return cont; 
}


//--> se crea una matriz de 8x8
function llenarTablero(vector){
    let posicion = 0;
    let matrix = new Array();
    for(let i = 0; i < 8; i++){
        let temporal = new Array();
        for(let j = 0; j < 8; j++){
            temporal.push(vector[posicion]);
            posicion++;
        }
        matrix.push(temporal);
    }
    return matrix;
}

//--> se verifican los posibles movimientos que puede se pueden realizar segun el turno
function posibles_movimientos(tablero, turno){
    let coordenada = new Array();

    for(let i = 0; i < 8; i++){
        for(let j=0; j<8; j++){
            if(libre_movimiento(tablero,turno,i,j)){
                coordenada.push([i,j]); 
            }
        }
    }

    return coordenada;
}

function libre_movimiento(tablero, turno, fila, columna){
    //--> verificamos si la posicion no esta ocupada
    if(tablero[fila][columna] != 2){
        return false;
    }

    let mov_fil, mov_col, c;
    
    //------- verificamos los posibles movimientos hacia arriba
    mov_fil = fila - 1;
    mov_col = columna;
    contador = 0;

    while(mov_fil>0 && tablero[mov_fil][mov_col] == oponente){
        mov_fil--;
        contador++;
    }
    if(mov_fil>=0 && tablero[mov_fil][mov_col] == turno && contador>0){
        return true;
    } 

    //------- verificamos los posibles movimientos hacia abajo 
    mov_fil = fila + 1;
    mov_col = columna;
    contador = 0;
    while(mov_fil<7 && tablero[mov_fil][mov_col] == oponente){
         mov_fil++;
         contador++;
     }
     if(mov_fil<=7 && tablero[mov_fil][mov_col] == turno && contador>0){
         return true;
    }

     //------- verificamos los posibles movimientos hacia la izquierda
     mov_fil= fila;
     mov_col = columna - 1;
     contador = 0;
     while(mov_col>0 && tablero[mov_fil][mov_col] == oponente){
         mov_col--;
         contador++;
     }
     if(mov_col>=0 && tablero[mov_fil][mov_col] == turno && contador>0){
        return true;
     } 

     //------- verificamos los posibles movimientos hacia la derecha
     mov_fil= fila;
     mov_col = columna + 1;
     contador = 0;
     while(mov_col<7 && tablero[mov_fil][mov_col] == oponente){
         mov_col++;
         contador++;
     }
     if(mov_col<=7 && tablero[mov_fil][mov_col] == turno && contador>0){
        return true;
    } 

     //------- verificamos los posibles movimientos hacia arriba a la izquierda
     mov_fil= fila - 1;
     mov_col = columna - 1;
     contador = 0;
     while(mov_fil>0 && mov_col>0 && tablero[mov_fil][mov_col] == oponente){
         mov_fil--;
         mov_col--;
         contador++;
     }
     if(mov_fil>=0 && mov_col>=0 && tablero[mov_fil][mov_col] == turno && contador>0){
        return true;
    } 

     //------- verificamos los posibles movimientos hacia arriba a la derecha
     mov_fil= fila - 1;
     mov_col = columna + 1;
     contador = 0;
     while(mov_fil>0 && mov_col<7 && tablero[mov_fil][mov_col] == oponente){
         mov_fil--;
         mov_col++;
         contador++;
     }
     if(mov_fil>=0 && mov_col<=7 && tablero[mov_fil][mov_col] == turno && contador>0){
        return true;
    } 

     //------- verificamos los posibles movimientos hacia abajo a la izquierda
     mov_fil= fila + 1;
     mov_col = columna - 1;
     contador = 0;
     while(mov_fil<7 && mov_col>0 && tablero[mov_fil][mov_col] == oponente){
         mov_fil++;
         mov_col--;
         contador++;
     }
     if(mov_fil<=7 && mov_col>=0 && tablero[mov_fil][mov_col] == turno && contador>0){
        return true;
    } 

     //------- verificamos los posibles movimientos hacia abajo a la derecha
     mov_fil= fila + 1;
     mov_col = columna + 1;
     contador = 0;
     while(mov_fil<7 && mov_col<7 && tablero[mov_fil][mov_col] == oponente){
         mov_fil++;
         mov_col++;
         contador++;
     }
     if(mov_fil<=7 && mov_col<=7 && tablero[mov_fil][mov_col] == turno && contador>0){
        return true;
    } 
     
    //si no hay movimientos se retorna falso
     return false;

    
}

function nuevo_tablero(tablero, movimiento, turno){
    let nuevotab = [[0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0]];

    //guardamos el tablero actual
    for(let i = 0; i < 8; i++){
        for(let j = 0; j < 8; j++){
            nuevotab[i][j] = tablero[i][j];
        }
    }

    //simula el movimiento
    nuevotab[movimiento[0]][movimiento[1]] = turno;

    //revertir
    let arreglopos = revertir(tablero,turno,movimiento[0],movimiento[1]);
    for(let pos of arreglopos){
        nuevotab[pos[0]][pos[1]] = turno;
    }

    return nuevotab;

}

function revertir(tablero, turno, fila, columna){
    let rev_mov = new Array();
    
    let mov_fil , mov_col; 

    //arriba
    let arriba = new Array();
    mov_fil = fila - 1;
    mov_col = columna;
    while(mov_fil>0 && tablero[mov_fil][mov_col] == oponente){
        arriba.push([mov_fil,mov_col]);
        mov_fil--;
    }
    if(mov_fil>=0 && tablero[mov_fil][mov_col] == turno && arriba.length>0){
        
        arriba.forEach(element => {
            rev_mov.push(element);
        });
    }


    //abajo
    let abajo = new Array();
    mov_fil = fila + 1;
    mov_col = columna;
    while(mov_fil<7 && tablero[mov_fil][mov_col] == oponente){
        abajo.push([mov_fil,mov_col]);
        mov_fil++;
    }
    if(mov_fil<=7 && tablero[mov_fil][mov_col] == turno && abajo.length>0){
         
        abajo.forEach(element => {
            rev_mov.push(element);
        });
    }

    //izquierda
    let izquierda = new Array();
    mov_fil = fila;
    mov_col = columna - 1;
    while(mov_col>0 && tablero[mov_fil][mov_col] == oponente){
        izquierda.push([mov_fil,mov_col]);
        mov_col--;
    }
    if(mov_col>=0 && tablero[mov_fil][mov_col] == turno && izquierda.length>0){
         
        izquierda.forEach(element => {
            rev_mov.push(element);
        });
    }

    //derecha
    let derecha = new Array();
    mov_fil = fila;
    mov_col = columna + 1;
    while(mov_col<7 && tablero[mov_fil][mov_col] == oponente){
        derecha.push([mov_fil,mov_col]);
        mov_col++;
    }
    if(mov_col<=7 && tablero[mov_fil][mov_col] == turno && derecha.length>0){
        
        derecha.forEach(element => {
            rev_mov.push(element);
        });
    }

    //arriba a la izquierda
    let arribaizq = new Array();
    mov_fil = fila - 1;
    mov_col = columna - 1;
    while(mov_fil>0 && mov_col>0 && tablero[mov_fil][mov_col] == oponente){
        arribaizq.push([mov_fil,mov_col]);
        mov_fil--;
        mov_col--;
    }
    if(mov_fil>=0 && mov_col>=0 && tablero[mov_fil][mov_col] == turno && arribaizq.length>0){
        
        arribaizq.forEach(element => {
            rev_mov.push(element);
        });
    }

    //arriba a la derecha
    let arribader = new Array();
    mov_fil = fila - 1;
    mov_col = columna + 1;
    while(mov_fil>0 && mov_col<7 && tablero[mov_fil][mov_col] == oponente){
        arribader.push([mov_fil,mov_col]);
        mov_fil--;
        mov_col++;
    }
    if(mov_fil>=0 && mov_col<=7 && tablero[mov_fil][mov_col] == turno && arribader.length>0){
         
        arribader.forEach(element => {
            rev_mov.push(element);
        });
    }

    //abajo a la izquierda
    let abajoizq = new Array();
    mov_fil = fila + 1;
    mov_col = columna - 1;
    while(mov_fil<7 && mov_col>0 && tablero[mov_fil][mov_col] == oponente){
        abajoizq.push([mov_fil,mov_col]);
        mov_fil++;
        mov_col--;
    }
    if(mov_fil<=7 && mov_col>=0 && tablero[mov_fil][mov_col] == turno && abajoizq.length>0){
         
        abajoizq.forEach(element => {
            rev_mov.push(element);
        });
    }

    //abajo a la derecha
    let abajoder = new Array();
    mov_fil = fila + 1;
    mov_col = columna + 1;
    while(mov_fil<7 && mov_col<7 && tablero[mov_fil][mov_col] == oponente){
        abajoder.push([mov_fil,mov_col]);
        mov_fil++;
        mov_col++;
    }
    if(mov_fil<=7 && mov_col<=7 && tablero[mov_fil][mov_col] == turno && abajoder.length>0){
        
        abajoder.forEach(element => {
            rev_mov.push(element);
        });
    }
    
   return rev_mov;
}




