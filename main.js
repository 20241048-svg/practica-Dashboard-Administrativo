const tabla = document.getElementById("tablaProductos");
const cmbCategorias = document.getElementById("cate");
const busca = document.getElementById("buscarBarrita");
const pagina = document.getElementById("pagi");

let skip = 0;
const limit = 10;
let totalProductos = 0;
let filtros = {};
let productosGlobal = []; // para ordenar

document.addEventListener("DOMContentLoaded", () => {
    cargarCategorias();
    cargarProductos();

    document.getElementById("buscar").addEventListener("click", buscar);
    document.getElementById("btnAnterior").addEventListener("click", anterior);
    document.getElementById("btnSiguiente").addEventListener("click", siguiente);
    document.getElementById("agregar").addEventListener("click", agregar);
    cmbCategorias.addEventListener("change", filtrarCategoria);
    document.getElementById("cmbOrdenar").addEventListener("change", ordenar);
});

function cargarProductos() {
    let url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;

    if (filtros.busqueda) {
        url = `https://dummyjson.com/products/search?q=${filtros.busqueda}`;
    }

    if (filtros.categoria) {
        url = `https://dummyjson.com/products/category/${filtros.categoria}`;
    }

    fetch(url)
        .then(res => res.json())
        .then(data => {
            productosGlobal = data.products;
            totalProductos = data.total || productosGlobal.length;

            aplicarOrden();
            renderizarTabla(productosGlobal);
            actualizarPaginacion();
        });
}

function renderizarTabla(productos) {
    tabla.innerHTML = "";
    productos.forEach(p => {
        tabla.innerHTML += `
            <tr>
                <td>${p.id}</td>
                <td><img src="${p.thumbnail}" width="50"></td>
                <td>${p.title}</td>
                <td>$${p.price}</td>
                <td>${p.category}</td>
                <td class="text-center">
                    <button class="btn btn-warning btn-sm" onclick="editar(${p.id})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="eliminar(${p.id}, this)">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

// la pagi
function actualizarPaginacion() {
    const paginaActual = Math.floor(skip / limit) + 1;
    const totalPaginas = Math.ceil(totalProductos / limit);
    pagina.textContent = `Página ${paginaActual} de ${totalPaginas}`;
}

function siguiente() {
    if (skip + limit < totalProductos) {
        skip += limit;
        cargarProductos();
    }
}

function anterior() {
    if (skip >= limit) {
        skip -= limit;
        cargarProductos();
    }
}

// para buscar
function buscar() {
    filtros.busqueda = busca.value.trim();
    filtros.categoria = null;
    skip = 0;
    cargarProductos();
}

// las cate
function cargarCategorias() {
    fetch("https://dummyjson.com/products/category-list")
        .then(res => res.json())
        .then(categorias => {
            categorias.forEach(cat => {
                cmbCategorias.innerHTML += `<option value="${cat}">${cat}</option>`;
            });
        });
}

function filtrarCategoria() {
    filtros.categoria = cmbCategorias.value || null;
    filtros.busqueda = null;
    skip = 0;
    cargarProductos();
}

// para ordenar
function ordenar(e) {
    if (!e.target.value) {
        filtros.ordenar = null;
        renderizarTabla(productosGlobal);
        return;
    }

    const [campo, tipo] = e.target.value.split("-");
    filtros.ordenar = { campo, tipo };

    aplicarOrden();
    renderizarTabla(productosGlobal);
}

function aplicarOrden() {
    if (!filtros.ordenar) return;

    const { campo, tipo } = filtros.ordenar;

    productosGlobal.sort((a, b) => {
        if (tipo === "asc") {
            return a[campo] > b[campo] ? 1 : -1;
        } else {
            return a[campo] < b[campo] ? 1 : -1;
        }
    });
}

// segun el crud
function eliminar(id, btn) {
    if (!confirm("¿Eliminar producto?")) return;

    fetch(`https://dummyjson.com/products/${id}`, { method: "DELETE" })
        .then(res => res.json())
        .then(() => {
            btn.closest("tr").remove();
            alert("Producto eliminado");
        });
}

function editar(id) {
    const nuevoPrecio = prompt("Nuevo precio:");
    if (!nuevoPrecio) return;

    fetch(`https://dummyjson.com/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price: nuevoPrecio })
    })
    .then(res => res.json())
    .then(() => {
        alert("Producto actualizado");
        cargarProductos();
    });
}

