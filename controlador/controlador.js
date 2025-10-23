// Controlador

export default class ControladorCorreo {
    constructor(modelo, vista) {
        this.modelo = modelo;
        this.vista = vista;

        // Enlazar vista
        vista.onAdd = (data) => {
            try {
                this.modelo.agregar(data);
                this.vista.limpiarFormulario();
            } catch (e) {
                this.vista.mostrarError(e.message);
            }
        };

        vista.onToggle = (id) => this.modelo.cambiarEstado(id);
        vista.onDelete = (id) => this.modelo.eliminar(id);

        // Escuchar cambios del modelo
        this.modelo.addEventListener('modelo:cambio', (ev) => {
            const datos = ev.detail;
            this.vista.render(datos);
        });

        // Primer render
        this.vista.render(this.modelo.obtenerCopia());
    }
}
