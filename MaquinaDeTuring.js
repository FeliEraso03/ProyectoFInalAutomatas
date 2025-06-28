export class MaquinaDeTuring {
    constructor({
        blanco = '#',
        estadoInicial,
        estadosFinales = [],
        transiciones = {},
    }) {
        this.blanco = blanco;
        this.estadoInicial = estadoInicial;
        this.estadosFinales = new Set(estadosFinales);
        this.transiciones = transiciones;

        this.cinta = [];
        this.cabezal = 0;
        this.estado = estadoInicial;
        this.terminado = false;
    }

    inicializar(cintaEntrada) {
        this.cinta = [...cintaEntrada];
        this.estado = this.estadoInicial;
        this.cabezal = this.cinta.findIndex((s) => s !== this.blanco);
        if (this.cabezal < 0) this.cabezal = 0;
        this.terminado = false;
    }

    paso(renderCallback) {
        if (this.terminado) return;

        const simbolo = this.cinta[this.cabezal] ?? this.blanco;
        const clave = `${this.estado},${simbolo}`;
        const transicion = this.transiciones[clave];

        if (!transicion) {
            this.terminado = true;
            renderCallback?.(this.cinta, this.cabezal, this.estado, true);
            return;
        }

        this.cinta[this.cabezal] = transicion.escribir;

        if (transicion.mover === 'D') {
            this.cabezal++;
        } else if (transicion.mover === 'I') {
            this.cabezal--;
        }

        if (this.cabezal < 0) {
            this.cinta.unshift(this.blanco);
            this.cabezal = 0;
        } else if (this.cabezal >= this.cinta.length) {
            this.cinta.push(this.blanco);
        }

        this.estado = transicion.siguiente;

        while (this.cinta[0] === this.blanco && this.cinta[1] === this.blanco) {
            this.cinta.shift();
            this.cabezal--;
        }

        if (this.estadosFinales.has(this.estado)) {
            this.terminado = true;
        }

        renderCallback?.(this.cinta, this.cabezal, this.estado, this.terminado);
    }
}
