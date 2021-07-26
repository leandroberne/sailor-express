//////// CLASES

// Clase Producto utilizada

class Producto {
    constructor(titulo, precio, cantidad, imagen, id) {
        this.titulo = titulo;
        this.precio = precio;
        this.cantidad = cantidad;
        this.imagen = imagen;
        this.id = id;
    }
}

//////// VARIABLES

// Declaracion de selectores

const cardContainer = document.querySelector('#card-container');
const tableCarrito = document.querySelector('#lista-carrito tbody');
const precioTotal = document.querySelector('#precioTotal');
const btnFinalizar = document.querySelector('#btnFinalizar');
const btnCarrito = document.querySelector('#btnCarrito');
const notiCant = document.querySelector('#noti-cant');
const btnUp = document.querySelector('#btnUp');
const listaCarrito = document.querySelector('#lista-carrito');
const btnRefresh = document.querySelector('#btnRefresh');
const formSearch = document.querySelector('#form-search');
const nav = document.querySelector('nav');
const inputBuscador = document.querySelector('#buscador');

// Declaración de variables

let carrito = JSON.parse(localStorage.getItem('carrito'));

//////// LISTENERS

btnUp.addEventListener('click', topFunction);
cardContainer.addEventListener('click', agregarAlCarrito);
btnFinalizar.addEventListener('click', finalizarCompra);
listaCarrito.addEventListener('click', modificaCarrito);
btnRefresh.addEventListener('click', refrescarSearch);
formSearch.addEventListener('submit', submitSearch);
document.addEventListener('DOMContentLoaded', () => {
    inicialCarrito();
    inicializarProds();
});
window.addEventListener('scroll', function () {
    if (window.pageYOffset > 100) {
        nav.classList.add('bg-dark', 'shadow');
    } else {
        nav.classList.remove('bg-dark', 'shadow');
    }
});
window.onscroll = function() {
    scrollFunction();
};

//////// FUNCIONES

//////// EVENTOS

// Funcion-Evento click en botones "Agregar al carrito"

function agregarAlCarrito(e) {
    e.preventDefault();
    if (e.target.classList.contains("btn-warning")) {
        const id = (e.target.parentNode.parentNode.getAttribute('data-id'));

        if ((carrito.find(element => element.id === id)) === undefined) {
            const titulo = e.target.parentNode.childNodes[1].textContent;
            const precio = Number(e.target.parentNode.childNodes[4].textContent);
            const imagen = e.target.parentNode.parentNode.childNodes[0].getAttribute('src');
            carrito.push(new Producto(titulo, precio, 1, imagen, id));
        } else {
            const encontrado = carrito.find(element => element.id === id);
            encontrado.cantidad++;
        }
        localStorage.setItem('carrito', JSON.stringify(carrito));
        actualizarCarrito();
        habilitarCart();
        animacionCart();
    }
}

// Función-Evento para finalizar la compra (con SweetAlert)

function finalizarCompra() {
    localStorage.clear();
    carrito = [];
    tableCarrito.innerHTML = '';
    precioTotal.textContent = 0;
    $('.modal').modal('hide');
    Swal.fire(
        'Compra finalizada!',
        'En el transcurso de 7 días recibirás la misma.',
        'success'
    );
    deshabilitarCart();
}

// Función para aumentar/disminuir cantidades y borrar dentro del carrito (modal)

function modificaCarrito(e) {
    e.preventDefault();

    const id = (e.target.parentNode.parentNode.getAttribute('data-id')),
          tipo = e.target.className,
          eliminado = carrito.findIndex(prod => prod.id === id),
          encontrado = carrito.find(element => element.id === id);

    if (id !== null && tipo !== "") {
        if (e.target.classList.contains('fa-trash')) {
            carrito.splice(eliminado, 1);
            notiCant.textContent = Number(carrito.length);
        } else if (e.target.classList.contains('fa-minus')) {
            encontrado.cantidad--;
            if (encontrado.cantidad <= 0) {
                carrito.splice(eliminado, 1);
                notiCant.textContent = Number(carrito.length);
            }
        } else if (e.target.classList.contains('fa-plus')) {
            encontrado.cantidad++;
        }
        checkVacio();
        localStorage.setItem('carrito', JSON.stringify(carrito));
        actualizarCarrito();
    }
}

// Función para el submit del buscador

function submitSearch(e) {
    e.preventDefault();
    const busqueda = inputBuscador.value,
          inputFiltrado = busqueda.trim().toLowerCase(),
          resultado = arregloProds.filter(producto => producto.titulo.toLowerCase().includes(inputFiltrado));

    cardContainer.innerHTML = '';
    resultado.forEach(producto => {
        const {imagen, titulo, precio, id} = producto;
        const card = document.createElement('div');
        card.classList.add('card');
        card.setAttribute('style', 'width: 18rem');
        card.innerHTML = `<img src=${imagen} class="card-img-top" alt="Foto de producto">
                          <div class="card-body">
                            <h5 class="card-title">${titulo}</h5>
                            <span>$</span><span class="card-text">${precio}</span><p></p>
                            <a href="#" class="btn btn-warning">AGREGAR AL CARRITO</a>
                          </div>`;
        card.setAttribute('data-id', id);
        cardContainer.appendChild(card);
    });

    if (resultado.length === 0) {
        Swal.fire('No se han encontrado resultados');
    }
}

// Función botón "refrescar" del buscador

function refrescarSearch(e) {
    e.preventDefault();
    cardContainer.innerHTML = '';
    inicializarProds();
    inputBuscador.value = '';
}

// Función para el btnUp (lleva arriba de todo)

function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

//////// ARROW FUNCTIONS

// Función para inicializar carrito al comienzo

const inicialCarrito = () => {
    if (carrito === null) {
        carrito = [];
        deshabilitarCart();
    } else {
        localStorage.setItem('carrito', JSON.stringify(carrito));
        deshabilitarCart();
        if (carrito.length !== 0) {
            actualizarCarrito();
            habilitarCart();
        }
    }
}

// Función que inicializa los productos/cards en el HTML

const inicializarProds = () => {
    for (const producto of arregloProds) {
        const {imagen, titulo, precio, id} = producto;
        const card = document.createElement('div');
        card.classList.add('card');
        card.setAttribute('style', 'width: 18rem');
        card.innerHTML = `<img src=${imagen} class="card-img-top" alt="Foto de producto">
                          <div class="card-body">
                            <h5 class="card-title">${titulo}</h5>
                            <span>$</span><span class="card-text">${precio}</span><p></p>
                            <a href="#" class="btn btn-warning">AGREGAR AL CARRITO</a>
                          </div>`;
        card.setAttribute('data-id', id);
        cardContainer.appendChild(card);
    }
}

// Funcion que verifica si el carrito esta vacio

const checkVacio = () => {
    if (carrito.length <= 0) {
        localStorage.clear();
        carrito = [];
        deshabilitarCart();
    }
}

// Función que actualiza el modal del carrito

const actualizarCarrito = () => {
    tableCarrito.innerHTML = '';
    const carritoActual = JSON.parse(localStorage.getItem('carrito'));
    let precioTotalProd = 0;

    for (const producto of carritoActual) {
        const {imagen, titulo, cantidad, precio, id} = producto;
        const row = document.createElement('tr');
		row.innerHTML = `
		<td>
			<img src="${imagen}" width='100%'>
		</td>
		<td>${titulo}</td>
		<td>${cantidad}</td>
        <td>$${precio}</td>
        <td>
            <i class="fas fa-minus"></i>
            <i class="fas fa-plus"></i>
            <i class="fas fa-trash"></i>
        </td>
		`;
        row.setAttribute('data-id', id);
        tableCarrito.appendChild(row);
        precioTotalProd += (precio * cantidad);
    }
    precioTotal.textContent = `$${precioTotalProd}`;
}

// Funciones para habilitar/deshabilitar el boton carrito (con su notificador)

const deshabilitarCart = () => {
    btnCarrito.classList.add('disabled');
    btnCarrito.setAttribute('aria-disabled', 'true');
    document.querySelector('.fa-shopping-cart').style.color = 'grey';
    btnFinalizar.classList.add('disabled');
    btnFinalizar.setAttribute('aria-disabled', 'true');
    document.querySelector('.noti-cont').style.display = 'none';
    notiCant.textContent = Number(carrito.length);
}

const habilitarCart = () => {
    btnCarrito.classList.remove('disabled');
    btnCarrito.removeAttribute('aria-disabled');
    document.querySelector('.fa-shopping-cart').style.color = 'white';
    btnFinalizar.classList.remove('disabled');
    btnFinalizar.removeAttribute('aria-disabled');
    document.querySelector('.noti-cont').style.display = 'inline-block';
    notiCant.textContent = Number(carrito.length);
}

// Funcion para el "shake" animado del btnCarrito al agregar un elemento

const animacionCart = () => {
    btnCarrito.classList.add('ani_cta_buzz');
    setTimeout(() => {
        btnCarrito.classList.remove('ani_cta_buzz');
    }, 500);
}

// Función para btnUp

const scrollFunction = () => {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      btnUp.style.display = "block";
    } else {
      btnUp.style.display = "none";
    }
}
