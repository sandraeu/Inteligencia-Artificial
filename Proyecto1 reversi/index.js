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
    let mejor_punteo = -2147483648;
    let mejor_movimiento = null;

    let movimientos = posibles_movimientos(tablero,turno);

    let rand = getRandomInt(0, movimientos.length-1);
    console.log("le", movimientos.length);
    return movimientos[rand];

    /*for(let pos of posibles_movimientos(tablero,turno)){
        console.log("pos", pos);
        //---jugar hasta aqui funciona bien
        return pos;
        
    }*/
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
    c = 0;

    while(mov_fil>0 && tablero[mov_fil][mov_col] == oponente){
        mov_fil--;
        c++;
    }
    if(mov_fil>=0 && tablero[mov_fil][mov_col] == turno && c>0){
        return true;
    } 

    //------- verificamos los posibles movimientos hacia abajo 
    mov_fil = fila + 1;
    mov_col = columna;
    c = 0;
    while(mov_fil<7 && tablero[mov_fil][mov_col] == oponente){
         mov_fil++;
         c++;
     }
     if(mov_fil<=7 && tablero[mov_fil][mov_col] == turno && c>0){
         return true;
    }

     //------- verificamos los posibles movimientos hacia la izquierda
     mov_fil= fila;
     mov_col = columna - 1;
     c = 0;
     while(mov_col>0 && tablero[mov_fil][mov_col] == oponente){
         mov_col--;
         c++;
     }
     if(mov_col>=0 && tablero[mov_fil][mov_col] == turno && c>0){
        return true;
     } 

     //------- verificamos los posibles movimientos hacia la derecha
     mov_fil= fila;
     mov_col = columna + 1;
     c = 0;
     while(mov_col<7 && tablero[mov_fil][mov_col] == oponente){
         mov_col++;
         c++;
     }
     if(mov_col<=7 && tablero[mov_fil][mov_col] == turno && c>0){
        return true;
    } 

     //------- verificamos los posibles movimientos hacia arriba a la izquierda
     mov_fil= fila - 1;
     mov_col = columna - 1;
     c = 0;
     while(mov_fil>0 && mov_col>0 && tablero[mov_fil][mov_col] == oponente){
         mov_fil--;
         mov_col--;
         c++;
     }
     if(mov_fil>=0 && mov_col>=0 && tablero[mov_fil][mov_col] == turno && c>0){
        return true;
    } 

     //------- verificamos los posibles movimientos hacia arriba a la derecha
     mov_fil= fila - 1;
     mov_col = columna + 1;
     c = 0;
     while(mov_fil>0 && mov_col<7 && tablero[mov_fil][mov_col] == oponente){
         mov_fil--;
         mov_col++;
         c++;
     }
     if(mov_fil>=0 && mov_col<=7 && tablero[mov_fil][mov_col] == turno && c>0){
        return true;
    } 

     //------- verificamos los posibles movimientos hacia abajo a la izquierda
     mov_fil= fila + 1;
     mov_col = columna - 1;
     c = 0;
     while(mov_fil<7 && mov_col>0 && tablero[mov_fil][mov_col] == oponente){
         mov_fil++;
         mov_col--;
         c++;
     }
     if(mov_fil<=7 && mov_col>=0 && tablero[mov_fil][mov_col] == turno && c>0){
        return true;
    } 

     //------- verificamos los posibles movimientos hacia abajo a la derecha
     mov_fil= fila + 1;
     mov_col = columna + 1;
     c = 0;
     while(mov_fil<7 && mov_col<7 && tablero[mov_fil][mov_col] == oponente){
         mov_fil++;
         mov_col++;
         c++;
     }
     if(mov_fil<=7 && mov_col<=7 && tablero[mov_fil][mov_col] == turno && c>0){
        return true;
    } 
     
    //si no hay movimientos se retorna falso
     return false;

    
}


function nuevo_tablero(tablero, movimiento, turno){
    let nuevotab = new Array();

    for(let i = 0; i < 8; i++){
        for(let j = 0; j < 8; j++){
            nuevotab[i][j] = tablero[i][j];
        }
    }

    //simular el movimiento
    nuevotab[movimiento[0]][movimiento[1]] = turno;

    //revertir

}


function revertir(tablero, turno, fila, columna){
    let rev_mov = new Array();
    
    let mov_fil , mov_col; 

    //arriba
    let mupts = new Array();
    mov_fil = fila - 1;
    mov_col = columna;
    while(mov_fil>0 && tablero[mov_fil][mov_col] == oponente){
        mupts.push([mov_fil,mov_col]);
        mov_fil--;
    }
    if(mov_fil>=0 && tablero[mov_fil][mov_col] == turno && mupts.length>0){
        
        mupts.forEach(element => {
            rev_mov.push(element);
        });
    }


    //abajo
    let mdpts = new Array();
    mov_fil = fila + 1;
    mov_col = columna;
    while(mov_fil<7 && tablero[mov_fil][mov_col] == oponente){
        mdpts.add([mov_fil,mov_col]);
        mov_fil++;
    }
    if(mov_fil<=7 && tablero[mov_fil][mov_col] == turno && mdpts.length>0){
         
        mdpts.forEach(element => {
            rev_mov.push(element);
        });
    }

    //izquierda
    let mlpts = new Array();
    mov_fil = i;
    mov_col = columna - 1;
    while(mov_col>0 && tablero[mov_fil][mov_col] == oponente){
        mlpts.add([mov_fil,mov_col]);
        mov_col--;
    }
    if(mov_col>=0 && tablero[mov_fil][mov_col] == turno && mlpts.length>0){
         
        mlpts.forEach(element => {
            rev_mov.push(element);
        });
    }

    //derecha
    let mrpts = new Array();
    mov_fil = i;
    mov_col = columna + 1;
    while(mov_col<7 && tablero[mov_fil][mov_col] == oponente){
        mrpts.add([mov_fil,mov_col]);
        mov_col++;
    }
    if(mov_col<=7 && tablero[mov_fil][mov_col] == turno && mrpts.length>0){
        
        mrpts.forEach(element => {
            rev_mov.push(element);
        });
    }

    //arriba a la izquierda
    let mulpts = new Array();
    mov_fil = fila - 1;
    mov_col = columna - 1;
    while(mov_fil>0 && mov_col>0 && tablero[mov_fil][mov_col] == oponente){
        mulpts.add([mov_fil,mov_col]);
        mov_fil--;
        mov_col--;
    }
    if(mov_fil>=0 && mov_col>=0 && tablero[mov_fil][mov_col] == turno && mulpts.length>0){
        
        mulpts.forEach(element => {
            rev_mov.push(element);
        });
    }

    //arriba a la derecha
    let murpts = new Array();
    mov_fil = fila - 1;
    mov_col = columna + 1;
    while(mov_fil>0 && mov_col<7 && tablero[mov_fil][mov_col] == oponente){
        murpts.add([mov_fil,mov_col]);
        mov_fil--;
        mov_col++;
    }
    if(mov_fil>=0 && mov_col<=7 && tablero[mov_fil][mov_col] == turno && murpts.length>0){
         
        murpts.forEach(element => {
            rev_mov.push(element);
        });
    }

    //abajo a la izquierda
    let mdlpts = new Array();
    mov_fil = fila + 1;
    mov_col = columna - 1;
    while(mov_fil<7 && mov_col>0 && tablero[mov_fil][mov_col] == oponente){
        mdlpts.add([mov_fil,mov_col]);
        mov_fil++;
        mov_col--;
    }
    if(mov_fil<=7 && mov_col>=0 && tablero[mov_fil][mov_col] == turno && mdlpts.length>0){
         
        mdlpts.forEach(element => {
            rev_mov.push(element);
        });
    }

    //abajo a la derecha
    let mdrpts = new Array();
    mov_fil = fila + 1;
    mov_col = columna + 1;
    while(mov_fil<7 && mov_col<7 && tablero[mov_fil][mov_col] == oponente){
        mdrpts.add([mov_fil,mov_col]);
        mov_fil++;
        mov_col++;
    }
    if(mov_fil<=7 && mov_col<=7 && tablero[mov_fil][mov_col] == turno && mdrpts.length>0){
        
        mdrpts.forEach(element => {
            rev_mov.push(element);
        });
    }
    
   return rev_mov;
}