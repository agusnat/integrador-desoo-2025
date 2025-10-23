// Modelo

// Paquete
export class Paquete {
    constructor({ id, remitente, tracking, recibido = false, fecha = null }) {
        // Genero un id unico e irrepetible usando criptografia
        this.id = id ?? crypto.randomUUID();

        this.remitente = remitente.trim();
        this.tracking = tracking.trim();
        this.recibido = Boolean(recibido);

        // Retorna la fecha como cadena de texto (Estandar ISO)
        this.fecha = fecha ?? new Date().toISOString();
    }
}

export default class ModeloCorreo extends EventTarget {
    // Definimos una clave por defecto para el localStorage
    constructor(localKey = 'mvc-paquetes') {
        super();

        this.localKey = localKey;
        this.paquetes = this.#cargar();
    }

    // Guarda los paquetes
    #guardar() {
        localStorage.setItem(this.localKey, JSON.stringify(this.paquetes));

        // Envia un evento
        this.dispatchEvent(new CustomEvent('modelo:cambio', { 
            detail: this.obtenerCopia() 
        }));
    }

    // Cargar paquetes
    #cargar() {
        // Obtiene los paquetes desde el localStorage
        const raw = localStorage.getItem(this.localKey);

        // Si no hay datos, retorna un array vacio
        if (!raw) 
            return [];

        // Parsea los datos a json
        const arr = JSON.parse(raw);

        // Instancia cada paquete dentro del json
        return arr.map(p => new Paquete(p));
    }

    obtenerCopia() {
        // Evitamos que pueda modificar directamente los objetos internos con una copia
        return this.paquetes.map(p => ({ ...p }));
    }

    // Agrega el paquete al array
    agregar({ remitente, tracking }) {
        // Validamos los campos
        if (!remitente || !tracking) 
            throw new Error('Campos vacíos');

        // Evitar duplicados (Mismo codigo de seguimiento)
        if (this.paquetes.some(p => p.tracking.toLowerCase() === tracking.toLowerCase())) {
            throw new Error('Ya existe un paquete con ese código de seguimiento');
        }

        // Se agrega el objeto al inicio del array
        this.paquetes.unshift(new Paquete({ remitente, tracking }));
        this.#guardar();
    }

    // Cambia el estado del paquete (Recibido - En camino)
    cambiarEstado(id) {
        const p = this.paquetes.find(x => x.id === id);

        // Si no se encuentra el paquete, return.
        if (!p) 
            return;

        p.recibido = !p.recibido;
        this.#guardar();
    }

    // Elimina el paquete
    eliminar(id) {
        // Devuelve todos los paquetes, menos el que tiene el id especificado
        this.paquetes = this.paquetes.filter(p => p.id !== id);

        // Guarda los cambios
        this.#guardar();
    }
}
