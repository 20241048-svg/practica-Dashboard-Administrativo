const titulo = document.getElementById("titulo");
const descripcion = document.getElementById("descripcion");
const precio = document.getElementById("precio");
const stock = document.getElementById("stock");
const categoria = document.getElementById("categoria");

document.addEventListener("DOMContentLoaded", () => {
    cargarCategorias();
    document.getElementById("guardar").addEventListener("click", guardarProducto);
});

// cargar categorias
function cargarCategorias() {
    fetch("https://dummyjson.com/products/category-list")
        .then(res => res.json())
        .then(data => {
            data.forEach(cat => {
                categoria.innerHTML += `<option value="${cat}">${cat}</option>`;
            });
        });
}

// guardar producto
function guardarProducto() {
    if (!titulo.value || !descripcion.value || !precio.value || !stock.value || !categoria.value) {
        alert("Completa todos los campos");
        return;
    }

    fetch("https://dummyjson.com/products/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            title: titulo.value,
            description: descripcion.value,
            price: precio.value,
            stock: stock.value,
            category: categoria.value
        })
    })
    .then(res => res.json())
    .then(() => {
        alert("Producto agregado correctamente");
        location.href = "index.html";
    });
}
