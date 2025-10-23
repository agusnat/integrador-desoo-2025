import ControladorCorreo from './controlador/controlador.js';
import ModeloCorreo from './modelo/modelo.js';
import VistaCorreo from './vista/vista.js';

const modelo = new ModeloCorreo('mvc-paquetes'); // localStorage

// Elementos del DOM
const vista = new VistaCorreo({
    // Formulario
    form: document.getElementById('form-alta'),
    // Inputs
    inpRemitente: document.getElementById('inp-remitente'),
    inpTracking: document.getElementById('inp-tracking'),
    // Mensaje de error
    msgError: document.getElementById('msg-error'),
    // Tabla
    tbody: document.getElementById('tbody'),
    // Mensaje si la tabla esta vacia
    vacio: document.getElementById('vacio'),
});

// Agregar paquetes por defecto si no existen en localStorage
if (modelo.paquetes.length === 0) {
  modelo.agregar({ remitente: 'Correo Argentino', tracking: 'CA-123456' });
  modelo.agregar({ remitente: 'Mercado Envíos', tracking: 'ME-987654' });
}

new ControladorCorreo(modelo, vista);
