const puntosPartidaAnterior = sessionStorage.getItem('puntos');
if(puntosPartidaAnterior){
    console.log(puntosPartidaAnterior);
    document.getElementsByClassName('recordpuntos')[0].innerHTML = puntosPartidaAnterior;
    document.getElementsByClassName('puntosanteriores')[0].style.display = 'flex';
} else{ 
    document.getElementsByClassName('inigame')[0].style.display = 'flex';
}
const jugador = document.getElementsByClassName('jugador')[0];
const posicionInicialJugador = 300;
let posicionJugador = posicionInicialJugador;
jugador.style.bottom = posicionJugador+'px'
const puntos = document.getElementsByClassName('puntos')[0];
const altoContenedor = 500;
const anchoContenedor = 500;
const altoEspacioJugador = 200;
const altoJugador = 50;
const anchoJugador = 50;
const anchoSuelo = 100;
const tamanioObstaculo = 60;
const obstaculoDesaparece = -60;
const gravedad = 4;
let iniciaJuego = false;
let finDelJuego = false;
let cuentaPuntos = 0;
const contJuego = document.getElementsByClassName('contJuego')[0];
contJuego.style.width = anchoContenedor + 'px';
contJuego.style.height = altoContenedor + 'px';

let jugadorInterval;

function numeroAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
//Crear obstaculo con altos aleatorios
function crearobstaculo(){  
    let posicionLeft = anchoContenedor; 
    // Crear obstaculo abajo
    const obstaculo = document.createElement('div');
    obstaculo.className  = "obstaculo bottom"; 
    const altoBottom = numeroAleatorio(120, 300);
    obstaculo.style.height = altoBottom +'px';
    obstaculo.style.left = posicionLeft + 'px';

    // Crear obstaculo arriba (Este lo creamos restando el tamaño del otro contenedor y dejando un espacio para que entre el personaje jugador)
    const obstaculoTop = document.createElement('div');
    obstaculoTop.className  = "obstaculo top"; 
    obstaculoTop.style.height = (altoContenedor - (altoBottom + altoEspacioJugador)) + 'px';
    obstaculoTop.style.left = posicionLeft + 'px';

    // Añadir obstaculos al contenedor del juego
    if(!finDelJuego){
        contJuego.appendChild(obstaculo);
        contJuego.appendChild(obstaculoTop);
    }
    
   
    // Metodo de la función para movel el obstaculo
    function moverobstaculo(){         
        const jugadorTop = jugador.offsetTop;
        const jugadorBottom = jugador.offsetTop + altoJugador;
        const jugadorLeft = jugador.offsetLeft; 
        const obstaculoHeight = obstaculo.offsetTop;      
        const obstaculoTopHeight = obstaculoTop.offsetHeight; 

        posicionLeft -= 2;
        /* 
        Realizamos la verificación de colición
            Si la posición del objeto es menot a la del jugador 
            Y Si la posición del jugador en la parte de abajo es mayor o igual ala del obstaculo() en la parte de arriba
            O Si la posición del obstaculo en la parte de abajo es mayor a la del jugador de la parte de arriba
            Y Si la posición del obstuculo final(right) es mayor a la del jugador esto para evitar que siga validando el obstaculo que ya paso
        */
        if(
            (posicionLeft+2) <= (jugadorLeft + anchoJugador)+1 
            && (jugadorBottom>=obstaculoHeight 
            || obstaculoTopHeight>=jugadorTop) 
            && (posicionLeft + tamanioObstaculo) > jugadorLeft
            ){ 
            finDelJuego = true;
        } 
        // validamos que el jugador haya pasado bien
        else if( 
            jugadorLeft == (posicionLeft + tamanioObstaculo) ){
            cuentaPuntos += 1;
            puntos.innerHTML = cuentaPuntos;
        }
        // Congelamos el juego
        if(finDelJuego){
            final();  
            obstaculo.remove();
            obstaculoTop.remove();
            clearInterval(objeto); 
            return false;
        }


        obstaculo.style.left = posicionLeft +'px';
        obstaculoTop.style.left = posicionLeft +'px';
             
        
        
        // Si el ostaculo es menor a 100 left lo eliminamos para ir despejando el DOOM
        if(posicionLeft < obstaculoDesaparece){            
            obstaculo.remove();
            obstaculoTop.remove();
            clearInterval(objeto);
        }
        
        
        
        
    } 
    //Ejecutar tiempo de desplazamiento del obstaculos
    let objeto = setInterval(moverobstaculo, 20) 
    // Si el juego no esta finalizado genere cada 3 segundos un nuevo obstaculo
    if(!finDelJuego) setTimeout(crearobstaculo, 3000)
}
// Personaje o objeto que salta 
function personaje(){
    // Lestamos la gravedad para realizar la función de caída del jugador
    posicionJugador -= gravedad;
    if(posicionJugador<=anchoSuelo){
        final();
        return false;
    }
    jugador.style.bottom = posicionJugador + 'px';
} 

function iniciar(){  
    // Inicializaremos las variables 
    document.getElementsByClassName('puntosanteriores')[0].style.display = 'none';
    document.getElementsByClassName('inigame')[0].style.display = 'none'; 
    posicionJugador = posicionInicialJugador;
    cuentaPuntos = 0;
    puntos.innerHTML = 0; 
    iniciaJuego = true;
    finDelJuego = false;
    jugadorInterval = setInterval(personaje, 20)
    //Inicializamos los obstaculos
    crearobstaculo();
} 
// Finalizar el juego
function final(){ 
    location.href = "/";
    sessionStorage.setItem('puntos', cuentaPuntos);
    iniciaJuego = false;
    finDelJuego = true;
    clearInterval(jugadorInterval);
}
 
function capturaTeclado(e){ 
        //Capturar las teclas con las que se puede activar el salto
        if(e.keyCode === 32 || e.keyCode === 38 || e.keyCode === 87){
             // Validamos que el juego este iniciando antes de empezara saltar
            if(iniciaJuego && !finDelJuego){ 
                // Validamos que no supere la altura del contenedor
                if(posicionJugador < (altoContenedor - altoJugador)){ posicionJugador += 50 };
                // Agregamos nuevo valor
                jugador.style.bottom = posicionJugador + 'px';
            } 
        }
    
}
//Empezar captura de teclado
document.addEventListener('keyup', capturaTeclado)
