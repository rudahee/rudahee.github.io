class Carta {
    constructor(ruta_img, valor_puntuacion) {
        this.img = ruta_img;
        this.puntuacion = valor_puntuacion;
    }

    getImg() {
        return this.img;
    }
    getPuntuacion() {
        return this.puntuacion;
    }
}

class Personaje {
    constructor() {
        this.puntuacion = 0;
        this.cartas = [];
    }

    getPuntuacion() {
        return this.puntuacion;
    }

    getCartas() {
        return this.cartas;
    }

    addCarta(carta) {
        this.addPuntos(carta.getPuntuacion());
        this.cartas.push(carta)
    }

    addPuntos(puntos) {
        this.puntuacion = this.puntuacion + puntos;
    }

}

class CPU {
    constructor() {
        this.puntuacion = 0;
        this.cartas = [];
    }

    getPuntuacion() {
        return this.puntuacion;
    }

    getCartas() {
        return this.cartas;
    }

    addCarta(carta) {
        this.addPuntos(carta.getPuntuacion());
        this.cartas.push(carta)
    }

    addPuntos(puntos) {
        this.puntuacion = this.puntuacion + puntos;
    }

}

function iniciar_baraja() {
    let cartas = [];
    let ruta =  "img/baraja/";
    let palos = ["Bastos", "Copas", "Espadas", "Oros"];
    let ruta_completa;

    for (let i=1; i<=10; i++) {
        for (palo of palos) { 
            ruta_completa = ruta + i + palo + '.jpg';
            if (i <= 7) {
                cartas.push(new Carta(ruta_completa, i));
            } else {
                cartas.push(new Carta(ruta_completa, 0.5));
            }
        }    
    }
    
    return cartas;
}

function iniciar_jugadores(cantidad_jugadores) {
    let jugadores = [];
    for (let i=0; i<cantidad_jugadores+1; i++) {
        jugadores.push(new Personaje());
    }
    
    return jugadores;
}

function turno_cpu() {
    
    sacar_carta(cartas[pos]);
    jugador.addCarta(cartas[pos]);
    cartas.splice(pos, 1);
    
    let puntuacion_superar = 0;
    let puntuacion_cpu = 0;
    for (jugador of jugadores) {
        if (jugador.getPuntuacion > puntuacion_superar) {
            puntuacion_superar = jugador.getPuntuacion();
        }
    }

    while (puntuacion_cpu <= puntuacion_superar) {
        let posicion = Math.floor(Math.random() * cartas.length);
        puntuacion_cpu =+ cartas[posicion].getPuntuacion;
        sacar_carta(cartas[posicion]);
        cartas.splice(pos, 1);
    }

}

function sacar_carta(carta) {
    const img = document.createElement('img');
    img.src= carta.getImg();
    document.getElementById('cards-dropped').appendChild(img)
    img.className = 'cartas';
}

function guardar_cartas(area, cartas) {
    const zona_jugador = document.getElementById(area);
    const cartas_jugadas = document.getElementById('cards-dropped');

        cartas_jugadas.innerHTML = "";



    for (carta of cartas) {
        let aux = document.createElement('img');
        aux.src = carta.getImg();
        aux.setAttribute('class', 'cartas')

        zona_jugador.appendChild(aux);
    }

    
}

function empezar_juego(jugadores, cartas) {
    const carta_img = document.getElementById('deck-img');         
    let i = 0;



    carta_img.addEventListener('click', () => {

        let jugador = jugadores[i];
        let pos = Math.floor(Math.random() * cartas.length);

        sacar_carta(cartas[pos]);
        jugador.addCarta(cartas[pos]);
        cartas.splice(pos, 1);
        
        let puntos_marcador = document.getElementById('player-result-'+(i+1));
        let marcador = puntos_marcador.parentNode;
        
        puntos_marcador.innerText = jugador.getPuntuacion();
        marcador.setAttribute('class','active-player')

        if (jugador.getPuntuacion() > 7.5) {
            marcador.setAttribute('class','result-over')

            if (i < jugadores.length-1) {
                guardar_cartas('player'+(i+1)+'-area', jugador.getCartas());
                jugador = jugadores[i++];
            }
            /*
            else {
                turno_cpu(jugadores);
            }
            */
        }
    })

}


const boton_modal = document.getElementById('accept-modal-btn');

boton_modal.addEventListener('click', () => {
    const ventana_modal = document.getElementById('modal-background');
    ventana_modal.id = 'modal-hidden';
    let cartas = iniciar_baraja();
    console.log(document.getElementById('quantity-players-input').value)
    let jugadores = iniciar_jugadores(document.getElementById('quantity-players-input').value);
    empezar_juego(jugadores, cartas)

})





