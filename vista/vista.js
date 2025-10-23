// Vista: maneja el DOM, renderiza y emite eventos de UI hacia el controlador

export default class VistaCorreo {
    constructor(refs) {
        this.refs = refs;
        this.#interfazDeUsuario();
    }

    // callbacks que setea el controlador
    onAdd = null;
    onToggle = null;
    onDelete = null;

    #interfazDeUsuario() {
        const { form, inpRemitente, inpTracking, msgError } = this.refs;

        form.addEventListener('submit', (ev) => {
            // Cancelamos la accion por defecto del formulario
            ev.preventDefault();
            msgError.textContent = '';

            const remitente = inpRemitente.value.trim();
            const tracking = inpTracking.value.trim();

            // Validamos los campos
            if (!remitente || !tracking) {
                msgError.textContent = 'Completá remitente y código de seguimiento.';
                return;
            }

            this.onAdd && this.onAdd({ remitente, tracking });
        });
    }

    // Limpia los inputs despues de agregar un paquete
    limpiarFormulario() {
        const { inpRemitente, inpTracking } = this.refs;
        
        inpRemitente.value = '';
        inpTracking.value = '';
    }

    mostrarError(msg) {
        this.refs.msgError.textContent = msg;
    }

    render(paquetes) {
        const { tbody, vacio } = this.refs;

        tbody.innerHTML = '';

        // Si no hay paquetes mostrar mensaje
        vacio.hidden = paquetes.length === 0 ? false : true;

        // Agregamos cada paquete a la tabla
        for (const p of paquetes) {
            const tr = document.createElement('tr');
            tr.className = p.recibido ? 'row--recibido' : 'row--pendiente';

            const tdEstado = document.createElement('td');
            const badge = document.createElement('span');
            badge.className = `pill ${p.recibido ? 'recibido' : ''} badge status-ico`;
            badge.textContent = p.recibido ? 'Recibido' : 'En camino';
            tdEstado.appendChild(badge);

            const tdTrack = document.createElement('td');
            tdTrack.className = 'tracking';
            tdTrack.textContent = p.tracking;

            const tdRem = document.createElement('td');
            tdRem.textContent = p.remitente;

            const tdFecha = document.createElement('td');
            const f = new Date(p.fecha);
            tdFecha.textContent = f.toLocaleString();

            const tdAcc = document.createElement('td');
            tdAcc.className = 'actions';
            const btnToggle = document.createElement('button');
            btnToggle.textContent = p.recibido ? 'Marcar pendiente' : 'Marcar recibido';
            btnToggle.addEventListener('click', () => this.onToggle && this.onToggle(p.id));

            const btnDel = document.createElement('button');
            btnDel.textContent = 'Eliminar';
            btnDel.addEventListener('click', () => this.onDelete && this.onDelete(p.id));

            tdAcc.append(btnToggle, btnDel);

            tr.append(tdEstado, tdTrack, tdRem, tdFecha, tdAcc);
            tbody.appendChild(tr);
        }
    }
}
