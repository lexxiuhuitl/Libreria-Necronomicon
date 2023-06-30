let preciosPorProveedor = [];
const libros = [];

window.onload = inicializar;

function inicializar() {
  getLibros();
  getPreciosPorProveedor();
}

document
  .getElementById("formularioLibros")
  .addEventListener("submit", saveBook);

function saveBook(e) {
  const titulo = document.getElementById("nombre").value;
  const precio = Number(document.getElementById("precio").value);
  const proveedor = document.getElementById("proveedor").value;
  const autor = document.getElementById("autor").value;

  const libro = {
    titulo,
    precio,
    proveedor,
    autor,
  };

  if (localStorage.getItem("reg") === null) {
    let libros = [];
    libros.push(libro);
    localStorage.setItem("reg", JSON.stringify(libros));
  } else {
    let libros = JSON.parse(localStorage.getItem("reg"));
    libros.push(libro);
    localStorage.setItem("reg", JSON.stringify(libros));
  }

  getLibros();

  document.getElementById("formularioLibros").reset();
  e.preventDefault();

  getPreciosPorProveedor();
}

function getLibros() {
  const libros = JSON.parse(localStorage.getItem("reg"));
  let booksView = document.getElementById("reg");

  booksView.innerHTML = "";

  for (let i = 0; i < libros.length; i++) {
    let titulo = libros[i].titulo;
    let precio = libros[i].precio;
    let proveedor = libros[i].proveedor;
    let autor = libros[i].autor;
    booksView.innerHTML += `<tr><td>${titulo}</td><td>$${precio}</td><td>${proveedor}</td><td>${autor}</td></tr><button class="bit" onclick="deleteBook('${titulo}', ${i})">Eliminar</button>`;
  }
}

function deleteBook(indiceLibroAEliminar) {
  const libros = JSON.parse(localStorage.getItem("reg"));
  let libroAEliminar = null;
  for (let i = 0; i < libros.length; i++) {
    if (i == indiceLibroAEliminar) {
      libroAEliminar = libros[i];
      break;
    }
  }
  // Restar el precio del libro del total del proveedor
  if (libroAEliminar) {
    preciosPorProveedor[libroAEliminar.proveedor] -= libroAEliminar.precio;
  }

  libros.splice(indiceLibroAEliminar, 1);

  localStorage.setItem("reg", JSON.stringify(libros));

  getLibros();
  getPreciosPorProveedor();
}

getLibros();

function getPreciosPorProveedor() {
  // Obtener la tabla para mostrar los resultados
  const preciosPorProveedorTable = document.getElementById("resultados");

  // Obtener los libros del almacenamiento local
  const libros = JSON.parse(localStorage.getItem("reg"));

  // Inicializar la variable para almacenar los precios por proveedor
  let preciosPorProveedor = {};

  // Calcular los precios por proveedor
  libros.forEach((libro) => {
    if (!preciosPorProveedor[libro.proveedor]) {
      preciosPorProveedor[libro.proveedor] = 0;
    }
    preciosPorProveedor[libro.proveedor] += libro.precio;
  });

  // Eliminar las filas actuales de la tabla
  while (preciosPorProveedorTable.rows.length > 1) {
    preciosPorProveedorTable.deleteRow(-1);
  }

  // Agregar las filas de precios por proveedor a la tabla
  for (const proveedor in preciosPorProveedor) {
    const row = preciosPorProveedorTable.insertRow(-1);
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    cell1.innerHTML = proveedor;
    cell2.innerHTML = "$" + preciosPorProveedor[proveedor];
  }
}
