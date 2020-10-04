const boton_modal = document.getElementById('accept-modal-btn');
const carta_img = document.getElementById('deck-img');

// CLASES
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


// INICIAR ELEMENTOS DEL JUEGO
function iniciar_baraja() {
    let cartas = [];
    let ruta = "img/baraja/";
    let palos = ["Bastos", "Copas", "Espadas", "Oros"];
    let ruta_completa;

    for (let i = 1; i <= 10; i++) {
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
    for (let i = 0; i < cantidad_jugadores; i++) {
        jugadores.push(new Personaje());
    }
    return jugadores;
}

function iniciar_area_de_juego(cant_jugadores) {
    if (cant_jugadores >= 1 && cant_jugadores <= 3) {
        if (cant_jugadores == 1) {
            console.log(document.getElementById("player-2"))
            document.getElementById("player-2").setAttribute('class', 'player-hidden');
            document.getElementById("player-3").setAttribute('class', 'player-hidden');
            document.getElementById('player2-area').setAttribute('class', 'area-hidden');
            document.getElementById('player3-area').setAttribute('class', 'area-hidden');
        } else if (cant_jugadores == 2) {
            document.getElementById('player3-area').setAttribute('class', 'area-hidden');
            document.getElementById("player-3").setAttribute('class', 'player-hidden');
        }
    } else {
        alert("Cantidad de juegadores no valida")
    }
}


// ELEMENTOS DEL JUEGO
function sacar_carta(cartas) {
    let pos = Math.floor(Math.random() * cartas.length);
    let carta = cartas[pos];

    const img = document.createElement('img');
    img.src = carta.getImg();
    img.className = 'cartas';

    document.getElementById('cards-dropped').appendChild(img)
    cartas.splice(pos, 1);

    return carta;
}

function actualizar_contador(jugadores, indice) {
    let puntos_marcador = document.getElementById('player-result-' + (parseInt(indice) + 1));
    let puntuacion = jugadores[indice].getPuntuacion();
    let perder = false
    puntos_marcador.innerText = puntuacion;

    if (puntuacion > 7.5) {
        puntos_marcador.parentNode.classList.add('result-over')
        perder = true;
    }
    return perder;
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

function jugador_activo(indice) {
    let puntos_marcador = document.getElementById('player-result-' + (parseInt(indice) + 1));

    puntos_marcador.parentNode.setAttribute('class', 'active-player')
    document.getElementById('player' + (parseInt(indice) + 1) + '-area').classList.add('area-activa');
}

function desactivar_jugador_activo(indice) {
    let puntos_marcador = document.getElementById('player-result-' + (parseInt(indice) + 1));

    puntos_marcador.parentNode.classList.remove('active-player')
    document.getElementById('player' + (parseInt(indice) + 1) + '-area').classList.remove('area-activa');
}

function turno_cpu(jugadores, cartas) {
    let max_puntuacion = 0;
    let puntuacion_cpu = 0;
    let cartas_cpu = []
    let puntos_marcador = document.getElementById('cpu-result');

    puntos_marcador.parentNode.setAttribute('class', 'active-player')
    document.getElementById('cpu-area').classList.add('area-activa');


    for (jugador of jugadores) {
        if (jugador.getPuntuacion() > max_puntuacion && jugador.getPuntuacion() <= 7.5) {
            max_puntuacion = jugador.getPuntuacion();
        }
    }

    while (puntuacion_cpu < max_puntuacion) {
        cartas_cpu.push(sacar_carta(cartas));
        puntuacion_cpu = cartas_cpu[cartas_cpu.length - 1].getPuntuacion() + puntuacion_cpu;
        puntos_marcador.innerText = puntuacion_cpu;
    }

    if (puntuacion_cpu > 7.5) {
        puntos_marcador.parentNode.classList.add('result-over');
    }

    guardar_cartas('cpu-area', cartas_cpu);

    puntos_marcador.parentNode.classList.remove('active-player')
    document.getElementById('cpu-area').classList.remove('area-activa');

    decidir_ganador(jugadores, puntuacion_cpu);

}

function decidir_ganador(jugadores, puntuacion_cpu) {
    let indice_jugadores = [];
    let texto_ganadores = document.getElementById('modal-title-winners');
    let texto_indice_ganadores = "";
    const restart = document.getElementById('restart');

    if (puntuacion_cpu > 7.5) {
        for (jugador in jugadores) {
            if (jugadores[jugador].getPuntuacion() <= 7.5) {
                indice_jugadores.push(parseInt(jugador) + 1);
            }
        }
    } else {
        for (jugador in jugadores) {
            if (jugadores[jugador].getPuntuacion() <= 7.5 && jugadores[jugador].getPuntuacion() > puntuacion_cpu) {
                indice_jugadores.push(parseInt(jugador) + 1);
            }
        }
    }
    console.log(indice_jugadores)
    if (indice_jugadores.length == 0) {
        texto_ganadores.textContent = '¡Gana la CPU!';
    }
    else {
        if (indice_jugadores.length == 1) {
            texto_ganadores.textContent = 'Ha ganado el jugador ' + indice_jugadores[0];
        }
        else {

            for (i of indice_jugadores) {
                texto_indice_ganadores = texto_indice_ganadores + "- jugador " + i + " <br>";
            }
            texto_ganadores.innerHTML = 'Han ganado: <br>' + texto_indice_ganadores;
        }
    }

    document.getElementById('modal-background-winners').setAttribute('class', 'modal-flex modal-background')

    restart.addEventListener('click', () => {
        location.reload(true)
    })

}

function juego(cant_jugadores) {
    let cartas = iniciar_baraja();
    let jugadores = iniciar_jugadores(cant_jugadores);
    let indice = 0;

    const carta_img = document.getElementById('deck-img');
    const plantarse = document.getElementById('plantarse')

    iniciar_area_de_juego(cant_jugadores);
    jugador_activo(indice);

    carta_img.addEventListener('click', () => {

        jugadores[indice].addCarta(sacar_carta(cartas));
        if (actualizar_contador(jugadores, indice)) {
            guardar_cartas('player' + (indice + 1) + '-area', jugadores[indice].getCartas());
            desactivar_jugador_activo(indice);
            indice = parseInt(indice) + 1;
        }

        if (indice > jugadores.length - 1) {
            turno_cpu(jugadores, cartas);
        } else {
            jugador_activo(indice);
        }

    })

    plantarse.addEventListener('click', () => {

        actualizar_contador(jugadores, indice);

        guardar_cartas('player' + (indice + 1) + '-area', jugadores[indice].getCartas());
        desactivar_jugador_activo(indice);
        indice = parseInt(indice) + 1;


        if (indice > jugadores.length - 1) {
            turno_cpu(jugadores, cartas);
        } else {
            jugador_activo(indice);
        }
    })

}

boton_modal.addEventListener('click', () => {
    const ventana_modal = document.getElementById('modal-background');
    ventana_modal.setAttribute('class', 'modal-hidden');
    let cant_jugadores = document.getElementById('quantity-players-input').value;
    juego(cant_jugadores)
})