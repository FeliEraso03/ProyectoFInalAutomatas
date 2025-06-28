import { MaquinaDeTuring } from './MaquinaDeTuring.js';

let maquina;
let intervalo = null;
const velocidadesDisponibles = [
    1000, 750, 500, 400, 300, 200, 150, 100, 75, 50, 40, 30, 25, 20, 15, 12, 10, 1
];
let velocidadIndex = 0;
let velocidad = velocidadesDisponibles[velocidadIndex];

function renderCinta(cinta, cabezal, estado, terminado) {
    const contenedor = document.getElementById('cinta');
    const estadoDiv = document.getElementById('estado');
    const logDiv = document.getElementById('pasosLog');

    contenedor.innerHTML = '';

    const visual = cinta
        .map((s, i) => (i === cabezal ? `[${s}]` : ` ${s} `))
        .join('');
    const anchoFijo = 20;
    const estadoLabel = `Estado: ${estado}`;
    const estadoFormateado =
        estadoLabel.length > anchoFijo
            ? estadoLabel.slice(0, anchoFijo)
            : estadoLabel.padEnd(anchoFijo, ' ');

    logDiv.textContent += `${estadoFormateado}| Cinta: ${visual}\n`;
    logDiv.scrollTop = logDiv.scrollHeight;

    cinta.forEach((simbolo, i) => {
        const celda = document.createElement('div');
        celda.className = 'celda' + (i === cabezal ? ' cabezal' : '');
        celda.textContent = simbolo;
        contenedor.appendChild(celda);
    });

    estadoDiv.textContent = `Estado: ${estado}${terminado ? '' : ''}`;
}

function actualizarVelocidadDisplay() {
    const factor = 1000 / velocidad;
    const texto =
        factor >= 10 ? `${factor.toFixed(1)}x` : `${factor.toFixed(2)}x`;
    document.getElementById('velocidadActual').textContent = texto;
}

function iniciarAutomatico() {
    if (!maquina || maquina.terminado) return;
    if (intervalo) return;
    intervalo = setInterval(() => {
        maquina.paso(renderCinta);
        if (maquina.terminado) detenerAutomatico();
    }, velocidad);
}

function detenerAutomatico() {
    clearInterval(intervalo);
    intervalo = null;
}

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('cargarBtn').onclick = () => {
        const entrada = document.getElementById('entrada').value;
        const cintaInicial = ['#', ...entrada.split(''), '#'];
        document.getElementById('pasosLog').textContent = '';

        const transiciones = {
            'q0,1': { escribir: '1', mover: 'D', siguiente: 'q1' },
            'q0,0': { escribir: '0', mover: 'D', siguiente: 'q1' },

            'q1,1': { escribir: '1', mover: 'D', siguiente: 'q1' },
            'q1,0': { escribir: '0', mover: 'D', siguiente: 'q1' },
            'q1,+': { escribir: '+', mover: 'D', siguiente: 'q2' },

            'q2,1': { escribir: '1', mover: 'D', siguiente: 'q3' },
            'q2,0': { escribir: '0', mover: 'D', siguiente: 'q3' },

            'q3,1': { escribir: '1', mover: 'D', siguiente: 'q3' },
            'q3,0': { escribir: '0', mover: 'D', siguiente: 'q3' },
            'q3,+': { escribir: '+', mover: 'D', siguiente: 'q2' },

            // escribir =
            'q3,#': { escribir: '=', mover: 'I', siguiente: 'q4' },

            // reemplazar
            'q4,1': { escribir: 'V', mover: 'I', siguiente: 'q5_1' },
            'q4,0': { escribir: 'W', mover: 'I', siguiente: 'q5_Vux' },
            'q4,X': { escribir: 'X', mover: 'I', siguiente: 'q4' },
            'q4,Y': { escribir: 'Y', mover: 'I', siguiente: 'q4' },
            'q4,V': { escribir: 'V', mover: 'I', siguiente: 'q5_Vux' },
            'q4,W': { escribir: 'W', mover: 'I', siguiente: 'q5_Vux' },
            'q4,+': { escribir: '+', mover: 'I', siguiente: 'q4_Aux' },

            'q5_1,0': { escribir: '0', mover: 'I', siguiente: 'q5_1' },
            'q5_1,1': { escribir: '1', mover: 'I', siguiente: 'q5_1' },
            'q5_1,X': { escribir: 'X', mover: 'I', siguiente: 'q5_1' },
            'q5_1,Y': { escribir: 'Y', mover: 'I', siguiente: 'q5_1' },
            'q5_1,+': { escribir: '+', mover: 'I', siguiente: 'q5_1' },
            'q5_1,S': { escribir: 'S', mover: 'I', siguiente: 'q5_1S' },
            'q5_1,#': { escribir: 'S', mover: 'I', siguiente: 'q5_1_S' },

            // acumular
            'q5_1_S,#': { escribir: 'A', mover: 'D', siguiente: 'q5' },
            'q5,S': { escribir: 'S', mover: 'D', siguiente: 'q5' },

            'q5,A': { escribir: 'A', mover: 'D', siguiente: 'q5' },
            'q5,B': { escribir: 'B', mover: 'D', siguiente: 'q5' },
            'q5,C': { escribir: 'C', mover: 'D', siguiente: 'q5' },
            'q5,D': { escribir: 'D', mover: 'D', siguiente: 'q5' },
            'q5,E': { escribir: 'B', mover: 'D', siguiente: 'q5' },
            'q5,F': { escribir: 'C', mover: 'D', siguiente: 'q5' },
            'q5,G': { escribir: 'D', mover: 'D', siguiente: 'q5' },

            'q5,1': { escribir: '1', mover: 'D', siguiente: 'q5' },
            'q5,0': { escribir: '0', mover: 'D', siguiente: 'q5' },
            'q5,X': { escribir: 'X', mover: 'D', siguiente: 'q5' },
            'q5,Y': { escribir: 'Y', mover: 'D', siguiente: 'q5' },
            'q5,+': { escribir: '+', mover: 'D', siguiente: 'q5' },
            'q5,V': { escribir: 'V', mover: 'D', siguiente: 'q5' },
            'q5,W': { escribir: 'W', mover: 'D', siguiente: 'q5' },
            'q5,=': { escribir: '=', mover: 'I', siguiente: 'q4' },

            'q5_Vux,0': { escribir: '0', mover: 'I', siguiente: 'q5_Vux' },
            'q5_Vux,1': { escribir: '1', mover: 'I', siguiente: 'q5_Vux' },
            'q5_Vux,V': { escribir: 'V', mover: 'I', siguiente: 'q5_Vux' },
            'q5_Vux,W': { escribir: 'W', mover: 'I', siguiente: 'q5_Vux' },
            'q5_Vux,X': { escribir: 'X', mover: 'I', siguiente: 'q5_Vux' },
            'q5_Vux,Y': { escribir: 'Y', mover: 'I', siguiente: 'q5_Vux' },

            'q5_Vux,#': { escribir: 'S', mover: 'I', siguiente: 'q5_Vux_S' },
            'q5_Vux_S,#': { escribir: 'Q', mover: 'D', siguiente: 'q5' },

            'q5_Vux,+': { escribir: '+', mover: 'I', siguiente: 'q4' },

            'q4_Aux,0': { escribir: '0', mover: 'N', siguiente: 'q4' },
            'q4_Aux,1': { escribir: '1', mover: 'N', siguiente: 'q4' },
            'q4_Aux,X': { escribir: 'X', mover: 'I', siguiente: 'q4_Aux' },
            'q4_Aux,Y': { escribir: 'Y', mover: 'I', siguiente: 'q4_Aux' },
            'q4_Aux,W': { escribir: 'W', mover: 'N', siguiente: 'q4' },
            'q4_Aux,V': { escribir: 'V', mover: 'N', siguiente: 'q4' },
            'q4_Aux,S': { escribir: 'S', mover: 'N', siguiente: 'q4' },
            'q4_Aux,+': { escribir: '+', mover: 'N', siguiente: 'q4' },

            'q5_1S,#': { escribir: 'Q', mover: 'N', siguiente: 'q5_1S' },
            'q5_1S,Q': { escribir: 'A', mover: 'D', siguiente: 'q5' },
            'q5_1S,A': { escribir: 'B', mover: 'D', siguiente: 'q5' },
            'q5_1S,B': { escribir: 'C', mover: 'D', siguiente: 'q5' },
            'q5_1S,C': { escribir: 'D', mover: 'D', siguiente: 'q5' },
            'q5_1S,D': { escribir: 'E', mover: 'D', siguiente: 'q5' },
            'q5_1S,E': { escribir: 'F', mover: 'D', siguiente: 'q5' },
            'q5_1S,F': { escribir: 'G', mover: 'D', siguiente: 'q5' },
            'q5_1S,G': { escribir: 'G', mover: 'D', siguiente: 'qError' },
            'q5_Vux,S': { escribir: 'S', mover: 'I', siguiente: 'q6' },

            // Transiciones para detectar letras A a G y cambiar de estado
            'q6,Q': { escribir: 'Q', mover: 'D', siguiente: 'q6_Q' },
            'q6,A': { escribir: 'A', mover: 'D', siguiente: 'q6_A' },
            'q6,B': { escribir: 'B', mover: 'D', siguiente: 'q6_B' },
            'q6,C': { escribir: 'C', mover: 'D', siguiente: 'q6_C' },
            'q6,D': { escribir: 'D', mover: 'D', siguiente: 'q6_D' },
            'q6,E': { escribir: 'E', mover: 'D', siguiente: 'q6_E' },
            'q6,F': { escribir: 'F', mover: 'D', siguiente: 'q6_F' },
            'q6,G': { escribir: 'G', mover: 'D', siguiente: 'q6_G' },
            'q6,#': { escribir: '#', mover: 'D', siguiente: 'q9' },

            // Reglas comunes para cada q6_X hasta encontrar '='
            'q6_Q,1': { escribir: '1', mover: 'D', siguiente: 'q6_Q' },
            'q6_Q,0': { escribir: '0', mover: 'D', siguiente: 'q6_Q' },
            'q6_Q,X': { escribir: 'X', mover: 'D', siguiente: 'q6_Q' },
            'q6_Q,Y': { escribir: 'Y', mover: 'D', siguiente: 'q6_Q' },
            'q6_Q,+': { escribir: '+', mover: 'D', siguiente: 'q6_Q' },
            'q6_Q,V': { escribir: 'V', mover: 'D', siguiente: 'q6_Q' },
            'q6_Q,W': { escribir: 'W', mover: 'D', siguiente: 'q6_Q' },
            'q6_Q,S': { escribir: 'S', mover: 'D', siguiente: 'q6_Q' },
            'q6_Q,=': { escribir: '=', mover: 'D', siguiente: 'q7_Q' },

            'q6_A,1': { escribir: '1', mover: 'D', siguiente: 'q6_A' },
            'q6_A,0': { escribir: '0', mover: 'D', siguiente: 'q6_A' },
            'q6_A,X': { escribir: 'X', mover: 'D', siguiente: 'q6_A' },
            'q6_A,Y': { escribir: 'Y', mover: 'D', siguiente: 'q6_A' },
            'q6_A,+': { escribir: '+', mover: 'D', siguiente: 'q6_A' },
            'q6_A,V': { escribir: 'V', mover: 'D', siguiente: 'q6_A' },
            'q6_A,W': { escribir: 'W', mover: 'D', siguiente: 'q6_A' },
            'q6_A,S': { escribir: 'S', mover: 'D', siguiente: 'q6_A' },
            'q6_A,=': { escribir: '=', mover: 'D', siguiente: 'q7_A' },

            'q6_B,1': { escribir: '1', mover: 'D', siguiente: 'q6_B' },
            'q6_B,0': { escribir: '0', mover: 'D', siguiente: 'q6_B' },
            'q6_B,X': { escribir: 'X', mover: 'D', siguiente: 'q6_B' },
            'q6_B,Y': { escribir: 'Y', mover: 'D', siguiente: 'q6_B' },
            'q6_B,+': { escribir: '+', mover: 'D', siguiente: 'q6_B' },
            'q6_B,V': { escribir: 'V', mover: 'D', siguiente: 'q6_B' },
            'q6_B,W': { escribir: 'W', mover: 'D', siguiente: 'q6_B' },
            'q6_B,S': { escribir: 'S', mover: 'D', siguiente: 'q6_B' },
            'q6_B,=': { escribir: '=', mover: 'D', siguiente: 'q7_B' },

            'q6_C,1': { escribir: '1', mover: 'D', siguiente: 'q6_C' },
            'q6_C,0': { escribir: '0', mover: 'D', siguiente: 'q6_C' },
            'q6_C,X': { escribir: 'X', mover: 'D', siguiente: 'q6_C' },
            'q6_C,Y': { escribir: 'Y', mover: 'D', siguiente: 'q6_C' },
            'q6_C,+': { escribir: '+', mover: 'D', siguiente: 'q6_C' },
            'q6_C,V': { escribir: 'V', mover: 'D', siguiente: 'q6_C' },
            'q6_C,W': { escribir: 'W', mover: 'D', siguiente: 'q6_C' },
            'q6_C,S': { escribir: 'S', mover: 'D', siguiente: 'q6_C' },
            'q6_C,=': { escribir: '=', mover: 'D', siguiente: 'q7_C' },

            'q6_D,1': { escribir: '1', mover: 'D', siguiente: 'q6_D' },
            'q6_D,0': { escribir: '0', mover: 'D', siguiente: 'q6_D' },
            'q6_D,X': { escribir: 'X', mover: 'D', siguiente: 'q6_D' },
            'q6_D,Y': { escribir: 'Y', mover: 'D', siguiente: 'q6_D' },
            'q6_D,+': { escribir: '+', mover: 'D', siguiente: 'q6_D' },
            'q6_D,V': { escribir: 'V', mover: 'D', siguiente: 'q6_D' },
            'q6_D,W': { escribir: 'W', mover: 'D', siguiente: 'q6_D' },
            'q6_D,S': { escribir: 'S', mover: 'D', siguiente: 'q6_D' },
            'q6_D,=': { escribir: '=', mover: 'D', siguiente: 'q7_D' },

            'q6_E,1': { escribir: '1', mover: 'D', siguiente: 'q6_E' },
            'q6_E,0': { escribir: '0', mover: 'D', siguiente: 'q6_E' },
            'q6_E,X': { escribir: 'X', mover: 'D', siguiente: 'q6_E' },
            'q6_E,Y': { escribir: 'Y', mover: 'D', siguiente: 'q6_E' },
            'q6_E,+': { escribir: '+', mover: 'D', siguiente: 'q6_E' },
            'q6_E,V': { escribir: 'V', mover: 'D', siguiente: 'q6_E' },
            'q6_E,W': { escribir: 'W', mover: 'D', siguiente: 'q6_E' },
            'q6_E,S': { escribir: 'S', mover: 'D', siguiente: 'q6_E' },
            'q6_E,=': { escribir: '=', mover: 'D', siguiente: 'q7_E' },

            'q6_F,1': { escribir: '1', mover: 'D', siguiente: 'q6_F' },
            'q6_F,0': { escribir: '0', mover: 'D', siguiente: 'q6_F' },
            'q6_F,X': { escribir: 'X', mover: 'D', siguiente: 'q6_F' },
            'q6_F,Y': { escribir: 'Y', mover: 'D', siguiente: 'q6_F' },
            'q6_F,+': { escribir: '+', mover: 'D', siguiente: 'q6_F' },
            'q6_F,V': { escribir: 'V', mover: 'D', siguiente: 'q6_F' },
            'q6_F,W': { escribir: 'W', mover: 'D', siguiente: 'q6_F' },
            'q6_F,S': { escribir: 'S', mover: 'D', siguiente: 'q6_F' },
            'q6_F,=': { escribir: '=', mover: 'D', siguiente: 'q7_F' },

            'q6_G,1': { escribir: '1', mover: 'D', siguiente: 'q6_G' },
            'q6_G,0': { escribir: '0', mover: 'D', siguiente: 'q6_G' },
            'q6_G,X': { escribir: 'X', mover: 'D', siguiente: 'q6_G' },
            'q6_G,Y': { escribir: 'Y', mover: 'D', siguiente: 'q6_G' },
            'q6_G,+': { escribir: '+', mover: 'D', siguiente: 'q6_G' },
            'q6_G,V': { escribir: 'V', mover: 'D', siguiente: 'q6_G' },
            'q6_G,W': { escribir: 'W', mover: 'D', siguiente: 'q6_G' },
            'q6_G,S': { escribir: 'S', mover: 'D', siguiente: 'q6_G' },
            'q6_G,=': { escribir: '=', mover: 'D', siguiente: 'q7_G' },

            'q7_Q,0': { escribir: '0', mover: 'D', siguiente: 'q7_Q' },
            'q7_Q,1': { escribir: '1', mover: 'D', siguiente: 'q7_Q' },

            'q7_A,0': { escribir: '0', mover: 'D', siguiente: 'q7_A' },
            'q7_A,1': { escribir: '1', mover: 'D', siguiente: 'q7_A' },

            'q7_B,0': { escribir: '0', mover: 'D', siguiente: 'q7_B' },
            'q7_B,1': { escribir: '1', mover: 'D', siguiente: 'q7_B' },

            'q7_C,0': { escribir: '0', mover: 'D', siguiente: 'q7_C' },
            'q7_C,1': { escribir: '1', mover: 'D', siguiente: 'q7_C' },

            'q7_D,0': { escribir: '0', mover: 'D', siguiente: 'q7_D' },
            'q7_D,1': { escribir: '1', mover: 'D', siguiente: 'q7_D' },

            'q7_E,0': { escribir: '0', mover: 'D', siguiente: 'q7_E' },
            'q7_E,1': { escribir: '1', mover: 'D', siguiente: 'q7_E' },

            'q7_F,0': { escribir: '0', mover: 'D', siguiente: 'q7_F' },
            'q7_F,1': { escribir: '1', mover: 'D', siguiente: 'q7_F' },

            'q7_G,0': { escribir: '0', mover: 'D', siguiente: 'q7_G' },
            'q7_G,1': { escribir: '1', mover: 'D', siguiente: 'q7_G' },

            'q7_A,#': { escribir: '1', mover: 'I', siguiente: 'q8' },
            'q7_Q,#': { escribir: '0', mover: 'I', siguiente: 'q8' },
            'q7_B,#': { escribir: '0', mover: 'I', siguiente: 'q8_A' },
            'q7_C,#': { escribir: '1', mover: 'I', siguiente: 'q8_A' },
            'q7_D,#': { escribir: '0', mover: 'I', siguiente: 'q8_B' },
            'q7_E,#': { escribir: '1', mover: 'I', siguiente: 'q8_B' },
            'q7_F,#': { escribir: '0', mover: 'I', siguiente: 'q8_C' },
            'q7_G,#': { escribir: '1', mover: 'I', siguiente: 'q8_C' },

            'q8,V': { escribir: 'X', mover: 'I', siguiente: 'q8' },
            'q8,W': { escribir: 'Y', mover: 'I', siguiente: 'q8' },
            'q8,0': { escribir: '0', mover: 'I', siguiente: 'q8' },
            'q8,1': { escribir: '1', mover: 'I', siguiente: 'q8' },
            'q8,X': { escribir: 'X', mover: 'I', siguiente: 'q8' },
            'q8,Y': { escribir: 'Y', mover: 'I', siguiente: 'q8' },
            'q8,+': { escribir: '+', mover: 'I', siguiente: 'q8' },
            'q8,S': { escribir: 'S', mover: 'I', siguiente: 'q8' },
            'q8,=': { escribir: '=', mover: 'I', siguiente: 'q8' },

            'q8_A,V': { escribir: 'X', mover: 'I', siguiente: 'q8_A' },
            'q8_A,W': { escribir: 'Y', mover: 'I', siguiente: 'q8_A' },
            'q8_A,0': { escribir: '0', mover: 'I', siguiente: 'q8_A' },
            'q8_A,1': { escribir: '1', mover: 'I', siguiente: 'q8_A' },
            'q8_A,X': { escribir: 'X', mover: 'I', siguiente: 'q8_A' },
            'q8_A,Y': { escribir: 'Y', mover: 'I', siguiente: 'q8_A' },
            'q8_A,+': { escribir: '+', mover: 'I', siguiente: 'q8_A' },
            'q8_A,S': { escribir: 'S', mover: 'I', siguiente: 'q8_A' },
            'q8_A,=': { escribir: '=', mover: 'I', siguiente: 'q8_A' },

            'q8_B,V': { escribir: 'X', mover: 'I', siguiente: 'q8_B' },
            'q8_B,W': { escribir: 'Y', mover: 'I', siguiente: 'q8_B' },
            'q8_B,0': { escribir: '0', mover: 'I', siguiente: 'q8_B' },
            'q8_B,1': { escribir: '1', mover: 'I', siguiente: 'q8_B' },
            'q8_B,X': { escribir: 'X', mover: 'I', siguiente: 'q8_B' },
            'q8_B,Y': { escribir: 'Y', mover: 'I', siguiente: 'q8_B' },
            'q8_B,+': { escribir: '+', mover: 'I', siguiente: 'q8_B' },
            'q8_B,S': { escribir: 'S', mover: 'I', siguiente: 'q8_B' },
            'q8_B,=': { escribir: '=', mover: 'I', siguiente: 'q8_B' },

            'q8_C,V': { escribir: 'X', mover: 'I', siguiente: 'q8_C' },
            'q8_C,W': { escribir: 'Y', mover: 'I', siguiente: 'q8_C' },
            'q8_C,0': { escribir: '0', mover: 'I', siguiente: 'q8_C' },
            'q8_C,1': { escribir: '1', mover: 'I', siguiente: 'q8_C' },
            'q8_C,X': { escribir: 'X', mover: 'I', siguiente: 'q8_C' },
            'q8_C,Y': { escribir: 'Y', mover: 'I', siguiente: 'q8_C' },
            'q8_C,+': { escribir: '+', mover: 'I', siguiente: 'q8_C' },
            'q8_C,S': { escribir: 'S', mover: 'I', siguiente: 'q8_C' },
            'q8_C,=': { escribir: '=', mover: 'I', siguiente: 'q8_C' },

            'q8,#': { escribir: '#', mover: 'D', siguiente: 'q5' },
            'q8,Q': { escribir: '#', mover: 'D', siguiente: 'q5' },
            'q8,A': { escribir: '#', mover: 'D', siguiente: 'q5' },
            'q8,B': { escribir: '#', mover: 'D', siguiente: 'q5' },
            'q8,C': { escribir: '#', mover: 'D', siguiente: 'q5' },
            'q8,D': { escribir: '#', mover: 'D', siguiente: 'q5' },
            'q8,E': { escribir: '#', mover: 'D', siguiente: 'q5' },
            'q8,F': { escribir: '#', mover: 'D', siguiente: 'q5' },
            'q8,G': { escribir: '#', mover: 'D', siguiente: 'q5' },

            'q8_A,A': { escribir: 'A', mover: 'D', siguiente: 'q5' },
            'q8_A,B': { escribir: 'A', mover: 'D', siguiente: 'q5' },
            'q8_A,C': { escribir: 'A', mover: 'D', siguiente: 'q5' },
            'q8_A,D': { escribir: 'A', mover: 'D', siguiente: 'q5' },
            'q8_A,E': { escribir: 'A', mover: 'D', siguiente: 'q5' },
            'q8_A,F': { escribir: 'A', mover: 'D', siguiente: 'q5' },
            'q8_A,G': { escribir: 'A', mover: 'D', siguiente: 'q5' },

            'q8_B,A': { escribir: 'B', mover: 'D', siguiente: 'q5' },
            'q8_B,B': { escribir: 'B', mover: 'D', siguiente: 'q5' },
            'q8_B,C': { escribir: 'B', mover: 'D', siguiente: 'q5' },
            'q8_B,D': { escribir: 'B', mover: 'D', siguiente: 'q5' },
            'q8_B,E': { escribir: 'B', mover: 'D', siguiente: 'q5' },
            'q8_B,F': { escribir: 'B', mover: 'D', siguiente: 'q5' },
            'q8_B,G': { escribir: 'B', mover: 'D', siguiente: 'q5' },

            'q8_C,A': { escribir: 'C', mover: 'D', siguiente: 'q5' },
            'q8_C,B': { escribir: 'C', mover: 'D', siguiente: 'q5' },
            'q8_C,C': { escribir: 'C', mover: 'D', siguiente: 'q5' },
            'q8_C,D': { escribir: 'C', mover: 'D', siguiente: 'q5' },
            'q8_C,E': { escribir: 'C', mover: 'D', siguiente: 'q5' },
            'q8_C,F': { escribir: 'C', mover: 'D', siguiente: 'q5' },
            'q8_C,G': { escribir: 'C', mover: 'D', siguiente: 'q5' },

            'q9,S': { escribir: 'S', mover: 'D', siguiente: 'q9' },
            'q9,X': { escribir: 'X', mover: 'D', siguiente: 'q9' },
            'q9,Y': { escribir: 'Y', mover: 'D', siguiente: 'q9' },
            'q9,+': { escribir: '+', mover: 'D', siguiente: 'q9' },

            'q9,0': { escribir: '0', mover: 'I', siguiente: 'qRevisar' },
            'q9,1': { escribir: '1', mover: 'I', siguiente: 'qRevisar' },

            'qRevisar,0': { escribir: '0', mover: 'I', siguiente: 'qRevisar' },
            'qRevisar,1': { escribir: '1', mover: 'I', siguiente: 'qRevisar' },
            'qRevisar,X': { escribir: 'X', mover: 'I', siguiente: 'qRevisar' },
            'qRevisar,Y': { escribir: 'Y', mover: 'I', siguiente: 'qRevisar' },
            'qRevisar,+': { escribir: '+', mover: 'I', siguiente: 'qRevisar' },
            'qRevisar,=': { escribir: '=', mover: 'I', siguiente: 'qRevisar' },
            'qRevisar,V': { escribir: 'V', mover: 'I', siguiente: 'qRevisar' },
            'qRevisar,W': { escribir: 'W', mover: 'I', siguiente: 'qRevisar' },
            'qRevisar,S': { escribir: 'S', mover: 'I', siguiente: 'qRevisar' },
            'qRevisar,#': { escribir: 'Q', mover: 'D', siguiente: 'q5_Vux' },

            'q4,S': { escribir: 'S', mover: 'I', siguiente: 'q6' },

            'q9,=': { escribir: '=', mover: 'D', siguiente: 'qInv' },
            'qInv,1': { escribir: 'X', mover: 'D', siguiente: 'qInv' },
            'qInv,0': { escribir: 'Y', mover: 'D', siguiente: 'qInv' },
            'qInv,#': { escribir: '#', mover: 'I', siguiente: 'qInv_N' },
            'qInv_N,X': { escribir: 'A', mover: 'I', siguiente: 'qInv_A' },
            'qInv_A,X': { escribir: 'X', mover: 'I', siguiente: 'qInv_A' },
            'qInv_A,Y': { escribir: 'Y', mover: 'I', siguiente: 'qInv_A' },
            'qInv_A,=': { escribir: '=', mover: 'D', siguiente: 'qInv_A_N' },
            'qInv_A_N,X': { escribir: '1', mover: 'D', siguiente: 'qInv_A_X' },
            'qInv_A_X,X': { escribir: 'X', mover: 'D', siguiente: 'qInv_A_X' },
            'qInv_A_X,Y': { escribir: 'Y', mover: 'D', siguiente: 'qInv_A_X' },
            'qInv_A_X,A': { escribir: '1', mover: 'I', siguiente: 'qInvL' },
            'qInv_A_N,Y': { escribir: '1', mover: 'D', siguiente: 'qInv_A_Y' },
            'qInv_A_Y,X': { escribir: 'X', mover: 'D', siguiente: 'qInv_A_Y' },
            'qInv_A_Y,Y': { escribir: 'Y', mover: 'D', siguiente: 'qInv_A_Y' },
            'qInv_A_Y,A': { escribir: '0', mover: 'I', siguiente: 'qInvL' },

            'qInv_N,Y': { escribir: 'B', mover: 'I', siguiente: 'qInv_B' },
            'qInv_B,X': { escribir: 'X', mover: 'I', siguiente: 'qInv_B' },
            'qInv_B,Y': { escribir: 'Y', mover: 'I', siguiente: 'qInv_B' },
            'qInv_B,=': { escribir: '=', mover: 'D', siguiente: 'qInv_B_N' },
            'qInv_B_N,X': { escribir: '0', mover: 'D', siguiente: 'qInv_B_X' },
            'qInv_B_X,X': { escribir: 'X', mover: 'D', siguiente: 'qInv_B_X' },
            'qInv_B_X,Y': { escribir: 'Y', mover: 'D', siguiente: 'qInv_B_X' },
            'qInv_B_X,B': { escribir: '1', mover: 'I', siguiente: 'qInvL' },
            'qInv_B_N,Y': { escribir: '0', mover: 'D', siguiente: 'qInv_B_Y' },
            'qInv_B_Y,X': { escribir: 'X', mover: 'D', siguiente: 'qInv_B_Y' },
            'qInv_B_Y,Y': { escribir: 'Y', mover: 'D', siguiente: 'qInv_B_Y' },

            'qInv_A_N,A': { escribir: '1', mover: 'I', siguiente: 'qR' },
            'qInv_A_N,B': { escribir: '1', mover: 'I', siguiente: 'qR' },

            'qInv_B_N,A': { escribir: '0', mover: 'I', siguiente: 'qR' },
            'qInv_B_N,B': { escribir: '0', mover: 'I', siguiente: 'qR' },

            'qInv_B_Y,B': { escribir: '0', mover: 'I', siguiente: 'qInvL' },

            'qInvL,X': { escribir: 'A', mover: 'I', siguiente: 'qInvL_A' },
            'qInvL_A,X': { escribir: 'X', mover: 'I', siguiente: 'qInvL_A' },
            'qInvL_A,Y': { escribir: 'Y', mover: 'I', siguiente: 'qInvL_A' },
            'qInvL_A,0': { escribir: '0', mover: 'D', siguiente: 'qInvL_A_N' },
            'qInvL_A,1': { escribir: '1', mover: 'D', siguiente: 'qInvL_A_N' },

            'qInvL_A_N,X': {
                escribir: '1',
                mover: 'D',
                siguiente: 'qInvL_A_X',
            },
            'qInvL_A_X,X': {
                escribir: 'X',
                mover: 'D',
                siguiente: 'qInvL_A_X',
            },
            'qInvL_A_X,Y': {
                escribir: 'Y',
                mover: 'D',
                siguiente: 'qInvL_A_X',
            },
            'qInvL_A_X,A': { escribir: '1', mover: 'I', siguiente: 'qInvL' },

            'qInvL_A_N,Y': {
                escribir: '1',
                mover: 'D',
                siguiente: 'qInvL_A_Y',
            },
            'qInvL_A_Y,X': {
                escribir: 'X',
                mover: 'D',
                siguiente: 'qInvL_A_Y',
            },
            'qInvL_A_Y,Y': {
                escribir: 'Y',
                mover: 'D',
                siguiente: 'qInvL_A_Y',
            },
            'qInvL_A_Y,A': { escribir: '0', mover: 'I', siguiente: 'qInvL' },

            'qInvL,Y': { escribir: 'B', mover: 'I', siguiente: 'qInvL_B' },
            'qInvL_B,X': { escribir: 'X', mover: 'I', siguiente: 'qInvL_B' },
            'qInvL_B,Y': { escribir: 'Y', mover: 'I', siguiente: 'qInvL_B' },
            'qInvL_B,0': { escribir: '0', mover: 'D', siguiente: 'qInvL_B_N' },
            'qInvL_B,1': { escribir: '1', mover: 'D', siguiente: 'qInvL_B_N' },

            'qInvL_B_N,X': {
                escribir: '0',
                mover: 'D',
                siguiente: 'qInvL_B_X',
            },
            'qInvL_B_X,X': {
                escribir: 'X',
                mover: 'D',
                siguiente: 'qInvL_B_X',
            },
            'qInvL_B_X,Y': {
                escribir: 'Y',
                mover: 'D',
                siguiente: 'qInvL_B_X',
            },
            'qInvL_B_X,B': { escribir: '1', mover: 'I', siguiente: 'qInvL' },

            'qInvL_B_N,Y': {
                escribir: '0',
                mover: 'D',
                siguiente: 'qInvL_B_Y',
            },
            'qInvL_B_Y,X': {
                escribir: 'X',
                mover: 'D',
                siguiente: 'qInvL_B_Y',
            },
            'qInvL_B_Y,Y': {
                escribir: 'Y',
                mover: 'D',
                siguiente: 'qInvL_B_Y',
            },
            'qInvL_B_Y,B': { escribir: '0', mover: 'I', siguiente: 'qInvL' },

            'qInvL_A_N,A': { escribir: '1', mover: 'I', siguiente: 'qR' },
            'qInvL_A_N,B': { escribir: '1', mover: 'I', siguiente: 'qR' },

            'qInvL_B_N,A': { escribir: '0', mover: 'I', siguiente: 'qR' },
            'qInvL_B_N,B': { escribir: '0', mover: 'I', siguiente: 'qR' },
            'qInvL,=': { escribir: '=', mover: 'N', siguiente: 'qR' },
            'qInvL,#': { escribir: '#', mover: 'I', siguiente: 'qR' },
            'qInvL,0': { escribir: '0', mover: 'I', siguiente: 'qR' },
            'qInvL,1': { escribir: '1', mover: 'I', siguiente: 'qR' },

            'qR,0': { escribir: '0', mover: 'I', siguiente: 'qR' },
            'qR,1': { escribir: '1', mover: 'I', siguiente: 'qR' },
            'qR,=': { escribir: '=', mover: 'I', siguiente: 'qF' },
            'qF,X': { escribir: '1', mover: 'I', siguiente: 'qF' },
            'qF,Y': { escribir: '0', mover: 'I', siguiente: 'qF' },
            'qF,+': { escribir: '+', mover: 'I', siguiente: 'qF' },
            'qF,S': { escribir: '#', mover: 'I', siguiente: 'qFin' },
        };

        maquina = new MaquinaDeTuring({
            blanco: '#',
            estadoInicial: 'q0',
            estadosFinales: ['qFin'],
            transiciones,
        });

        maquina.inicializar(cintaInicial);
        renderCinta(maquina.cinta, maquina.cabezal, maquina.estado, false);
    };

    document.getElementById('pasoSiguienteBtn').onclick = () => {
        if (maquina) maquina.paso(renderCinta);
    };

    document.getElementById('automaticoBtn').onclick = () => {
        if (intervalo) detenerAutomatico();
        else iniciarAutomatico();
    };

    document.getElementById('velocidadMenos').onclick = () => {
        if (velocidadIndex > 0) velocidadIndex--;
        velocidad = velocidadesDisponibles[velocidadIndex];
        actualizarVelocidadDisplay();
        if (intervalo) {
            detenerAutomatico();
            iniciarAutomatico();
        }
    };

    document.getElementById('velocidadMas').onclick = () => {
        if (velocidadIndex < velocidadesDisponibles.length - 1)
            velocidadIndex++;
        velocidad = velocidadesDisponibles[velocidadIndex];
        actualizarVelocidadDisplay();
        if (intervalo) {
            detenerAutomatico();
            iniciarAutomatico();
        }
    };

    actualizarVelocidadDisplay();
});
