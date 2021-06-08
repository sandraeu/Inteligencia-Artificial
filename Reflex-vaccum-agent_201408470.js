
class Estado{
    constructor(locacion, A_estado, B_estado, utilizado){
        this.locacion = locacion;
        this.A_estado = A_estado;
        this.B_estado = B_estado;
        this.utilizado = utilizado;
    }
}

let s0 = new Estado("A","DIRTY","DIRTY",false);
let s1 = new Estado("A","DIRTY","CLEAN",false);
let s2 = new Estado("A","CLEAN","DIRTY",false);
let s3 = new Estado("A","CLEAN","CLEAN",false);
let s4 = new Estado("B","DIRTY","DIRTY",false);
let s5 = new Estado("B","DIRTY","CLEAN",false);
let s6 = new Estado("B","CLEAN","DIRTY",false);
let s7 = new Estado("B","CLEAN","CLEAN",false);

let estados = new Array();
estados.push(s0);
estados.push(s1);
estados.push(s2);
estados.push(s3);
estados.push(s4);
estados.push(s5);
estados.push(s6);
estados.push(s7);

function reflex_agent(location, state){
    if (state=="DIRTY") return "CLEAN";
    else if (location=="A") return "RIGHT";
    else if (location=="B") return "LEFT";
}

function ensuciar(location, states){
    let random = numeroaleatorio(0,15);
    if( random < 5){
        if(location == "A" && states[1] == "CLEAN" ) states[1] = "DIRTY";
    }else if( random >= 5 && random < 10){
        if(location == "B"  && states[2] == "CLEAN") states[2] = "DIRTY";
    } 
}

function estado_utilizado(states){
    let pos = 0;
    for(let estado of estados){
        if(states[0] == estado.locacion && states[1] == estado.A_estado && states[2] == estado.B_estado){
            if(!estado.utilizado){
                estado.utilizado = true; 
                cont = cont + 1;
            } 
            console.log("Estado: " + pos  + ", " + estado.locacion  + ", " + estado.A_estado + ", " +  estado.B_estado);
        }
        pos = pos +1;
    }
}

function test(states){
      	var location = states[0];

      	var state = states[0] == "A" ? states[1] : states[2];

      	var action_result = reflex_agent(location, state);

      	document.getElementById("log").innerHTML+="<br>Location: ".concat(location).concat(" | Action: ").concat(action_result);

      	if (action_result == "CLEAN"){
        	if (location == "A") states[1] = "CLEAN";
         	else if (location == "B") states[2] = "CLEAN";
      	}
      	else if (action_result == "RIGHT") states[0] = "B";
      	else if (action_result == "LEFT") states[0] = "A";		
    
    ensuciar(location, states);
    estado_utilizado(states);
     
    if(cont < 8){   
	    setTimeout(function(){ test(states); }, 2000);
    }else{
        document.getElementById("log").innerHTML+="<br>** Se cumplieron los 8 estados ** <br><br> ************ Fin de la ejecucion ************";
    }
    
}

function numeroaleatorio(min,max){
    return Math.floor((Math.random() * (max-min)) +min);
}

var states = ["A","DIRTY","DIRTY"]; 
var cont = 0; 
test(states);

