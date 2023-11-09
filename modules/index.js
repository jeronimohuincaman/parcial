//######### Clases #########/
/**
 * Clase cuenta
 */
export class Cuenta {
    static idCuenta = 0;
    constructor(dueño, saldo) {
        this.idCuenta = ++Cuenta.idCuenta;
        this.dueño = dueño;
        this.saldo = saldo;
    }

    informacionCuenta() {
        console.log(`Id cuenta: ${this.idCuenta} | Dueño: ${this.dueño} | Saldo: ${this.saldo}`)
    }

    get cuentas() {
        return cuentas
    }
}

/**
 * CLase usuario
 */
export class Usuario {
    constructor(user, pass) {
        this.user = user;
        this.pass = pass;
        this.cuentas_bancarias = [];
    }

    agregarCuenta() {
        let nuevaCuenta = new Cuenta(this.user, 1500)
        this.cuentas_bancarias.push(nuevaCuenta)
        alert('Cuenta agregada con exito!')
    }

}

//######### Login #########/

let usuario1 = new Usuario('jero', '1234') // creo usuarios con  los cual puede loguearse
let usuario2 = new Usuario('admin', 'admin')

const usuarios = [usuario1, usuario2]

const form = document.getElementById('form');
form.addEventListener('submit', ($event) => { //Escucho un evento submit del formulario
    $event.preventDefault();

    const formData = new FormData(form);
    const formValues = Object.fromEntries(formData.entries()) //convierto los valores del formulario en un objeto que pueda manejar

    const usuario = auth(formValues.user, formValues.pass)

    //Al tener todo en un solo archivo JS pincha con otros formularios con el id='form'.
    if ($event.submitter.id === 'iniciar') {
        if (usuario) {
            window.location.href = './modules/panel.html'
            localStorage.setItem('user', usuario.user);
            localStorage.setItem('pass', usuario.pass);
        } else {
            alert('Usuario y/o contraseña incorrecta')
        }
    }
})

/**
 * Funcion que autentica al usuario
 */
function auth(username, password) {
    const user = usuarios.find((user) => (user.user === username && user.pass === password))
    const userIndex = usuarios.indexOf(user);
    localStorage.setItem('userId', userIndex)
    return user
}

//######### Panel #########/

const btn_more = document.getElementById('more')
btn_more.addEventListener('click', () => { //Escucho un evento del boton '+' para ocultar/mostrar el formulario
    let nuevaCuentaDiv = document.getElementById('nueva_cuenta')
    if (nuevaCuentaDiv.hidden == true) {
        nuevaCuentaDiv.hidden = false
    } else {
        nuevaCuentaDiv.hidden = true
    }
})

const btn_create = document.getElementById('crear')
btn_create.addEventListener('click', ($event) => { //Creo cuentas nuevas asociadas al id del usuario logueado
    $event.preventDefault();
    let username = localStorage.getItem('user')
    let saldo = document.getElementById('saldo').value

    const user = usuarios.find((user) => (user.user === username))
    const userIndex = usuarios.indexOf(user)
    const nuevaCuenta = new Cuenta(user, saldo)

    const cuenta_bancaria = user.cuentas_bancarias.find((cuenta) => cuenta.idCuenta === nuevaCuenta.idCuenta)

    if (!cuenta_bancaria) {
        user.cuentas_bancarias.push(nuevaCuenta)
        usuarios[userIndex] = user;
        completarSelectores()
    }
})



/**
 * Esta funcion sirve para autocompletar dinamicamente los selectores con las cuentas que se vayan creando
 */
function completarSelectores() {
    const select_origen = document.getElementById('origen');
    const select_destino = document.getElementById('destino');

    if (usuarios.length > 0) {
        const user = usuarios.find((usuario) => usuario.user === localStorage.getItem('user'))

        user.cuentas_bancarias.map((cuenta) => {

            let optionOrigen = document.getElementById(cuenta.idCuenta);
            let optionDestino = document.getElementById(cuenta.idCuenta)

            if (!optionOrigen) {
                optionOrigen = document.createElement('option');
                optionOrigen.id = cuenta.idCuenta;
                optionOrigen.innerHTML = `${cuenta.idCuenta}`;
                optionOrigen.value = `${cuenta.idCuenta}`;
                select_origen.appendChild(optionOrigen);
            }

            if (!optionDestino) {
                optionDestino = document.createElement('option');
                optionDestino.id = cuenta.idCuenta;
                optionDestino.innerHTML = `${cuenta.idCuenta}`;
                optionDestino.value = `${cuenta.idCuenta}`;
                select_destino.appendChild(optionDestino);
            }
        })
    }
}

//El siguiente codigo es de la transaccion, se muestra por consola
const btn_transaccion = document.getElementById('transaccion');
btn_transaccion.addEventListener('click', () => {
    const cuenta_origen = document.getElementById('origen').value
    const cuenta_destino = document.getElementById('destino').value
    const importe = document.getElementById('importe').value
    const user = usuarios.find((usuario) => usuario.user === localStorage.getItem('user'))
    let saldo = 0;

    user.cuentas_bancarias.forEach((cuenta) => {
        if (cuenta.idCuenta == cuenta_origen) {
            saldo = cuenta.saldo;
        }
    })
    
    let verificado = verificarTransaccion(cuenta_origen, cuenta_destino, importe, saldo)
    
    //dentro de la siguiente condicional efectuo la suma y resta de las cuentas origen y destino
    if (verificado) {
        user.cuentas_bancarias.forEach((cuenta) => {
            if (cuenta.idCuenta == cuenta_destino) {
                cuenta.saldo = Number(cuenta.saldo) + Number(importe)
                console.log(`Nuevo fondo de la cuenta ${cuenta.idCuenta} es de : $${cuenta.saldo}`)
                user.cuentas_bancarias.forEach((cuentaOrigen) => {
                    if (cuentaOrigen.idCuenta == cuenta_origen) {
                        cuentaOrigen.saldo = Number(cuentaOrigen.saldo) - Number(importe);
                        console.log(`Nuevo fondo de la cuenta ${cuentaOrigen.idCuenta} es de : $${cuentaOrigen.saldo}`)
                    }
                })
            }
        }
        )}})

    /**
     *  Verifico si puedo realizar la transaccion
     */
    function verificarTransaccion(cuenta_origen, cuenta_destino, importe, saldo) {
        let verficado

        if (cuenta_origen == cuenta_destino) {
            alert("La cuenta de origen y destino no pueden ser las mismas")
            verficado = false;
        } else if (importe >= saldo) {
            alert("No tiene suficiente dinero para realizar la transferencia")
            verficado = false;
        } else {
            console.log('!Transacción exitosa!')
            verficado = true;
        }

        return verficado;
    }

