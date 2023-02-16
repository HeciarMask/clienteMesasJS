/*
Cuando se inicia la aplicación todas las mesas estarán libres, se habrán cargado
todos los productos que se ofrecen en el catálogo y se pondrá la mesa 1 como
actual.
*/

let catalogo = new Catalogo();
let divCuenta = document.getElementById("cuenta");
let cuentaSeleccionada; //Objeto Cuenta
let productoSeleccionado; //Objeto producto
let listaCategorias;
let gestor = new Gestor();

comienzo();
document.getElementById("mesas").addEventListener("click", cambiarMesa);
document.frmControles.addEventListener("change", cambioProducto);
document.getElementById("teclado").addEventListener("click", teclaPulsada);
document.getElementById("cuenta").addEventListener("click", cambioUnidades);

function comienzo() {
	let cuentas = new Array();

	let mesas = document.getElementsByClassName("mesa");
	for (let mesa of mesas) {
		mesa.setAttribute("class", "mesa libre");
	}

	for (let i = 0; i < 9; i++) {
		cuentas[i] = new Cuenta(i + 1, true);
	}
	gestor.cuentas = cuentas;

	anadirProdCat();
	cargarControles();
	cambiaCuenta(1);
}

function cargarControles() {
	let cat = frmControles.categorias;

	for (let i = 0; i < listaCategorias.length; i++) {
		let opcion = document.createElement("option");
		opcion.setAttribute("value", i);
		opcion.textContent = listaCategorias[i];

		cat.append(opcion);
	}

	let seleccionado = cat.value;
	let productos = frmControles.productos;

	for (let prod of catalogo.productos) {
		if (prod.idCategoria == seleccionado) {
			let opcion = document.createElement("option");
			opcion.setAttribute("value", prod.idProducto);
			opcion.textContent = prod.nombreProducto;

			productos.append(opcion);
		}
	}
	for (let prod of catalogo.productos) {
		if (prod.idProducto == productos.value) {
			productoSeleccionado = prod;
		}
	}
}

function cambioProducto(event) {
	let objetivo = event.target;
	if (objetivo.getAttribute("name") == "categorias") {
		let seleccionado = objetivo.value;

		let productos = frmControles.productos;
		productos.innerHTML = "";
		for (let prod of catalogo.productos) {
			if (prod.idCategoria == seleccionado) {
				let opcion = document.createElement("option");
				opcion.setAttribute("value", prod.idProducto);
				opcion.textContent = prod.nombreProducto;

				productos.append(opcion);
			}
		}
		for (let prod of catalogo.productos) {
			if (prod.idProducto == productos.value) {
				productoSeleccionado = prod;
			}
		}
	} else {
		let seleccionado = frmControles.productos.value;
		for (let prod of catalogo.productos) {
			if (prod.idProducto == seleccionado) {
				productoSeleccionado = prod;
			}
		}
	}
}

function cambiarMesa(event) {
	let clickado = event.target;
	let patron = /mesa/g;
	if (patron.test(clickado.getAttribute("class"))) {
		cambiaCuenta(clickado.textContent);
	}
}

function cambiaCuenta(numMesa) {
	gestor.mesaActual = numMesa;

	while (divCuenta.children.length > 0) {
		divCuenta.children[0].remove();
	}

	for (let cuenta of gestor.cuentas) {
		if (cuenta.mesa == numMesa) {
			cuentaSeleccionada = cuenta;
		}
	}

	let suma = cuentaSeleccionada.calculaCuenta(catalogo);

	let salto = document.createTextNode("\n");
	let h1 = document.createElement("h1");
	h1.textContent = "Cuenta";

	divCuenta.append(h1);
	divCuenta.append(salto.cloneNode());

	let mesa = document.createElement("h2");
	mesa.textContent = "Mesa " + numMesa;

	divCuenta.append(mesa);
	divCuenta.append(salto.cloneNode());
	if (!cuentaSeleccionada.pagada) {
		let sCuenta = document.createElement("h2");
		sCuenta.textContent = "Total: " + Math.round(suma * 100) / 100 + "€";

		divCuenta.append(sCuenta);
		divCuenta.append(salto.cloneNode());

		let botonPagar = document.createElement("input");
		botonPagar.setAttribute("type", "button");
		botonPagar.setAttribute("value", "PAGAR Y LIBERAR LA MESA");
		botonPagar.setAttribute("class", "boton");
		botonPagar.setAttribute("id", "pagar");

		divCuenta.append(botonPagar);
		divCuenta.append(salto.cloneNode());

		let tabla = document.createElement("table");
		divCuenta.append(tabla);
		tabla.setAttribute("border", "solid");
		tabla.setAttribute("name", "lineas");
		tabla.insertRow();

		let th = document.createElement("th");
		th.textContent = "Modificar";
		tabla.children[0].append(th);
		th = th.cloneNode();
		th.textContent = "Uds.";
		tabla.children[0].append(th);
		th = th.cloneNode();
		th.textContent = "Id.";
		tabla.children[0].append(th);
		th = th.cloneNode();
		th.textContent = "Producto";
		tabla.children[0].append(th);
		th = th.cloneNode();
		th.textContent = "Precio";
		tabla.children[0].append(th);

		for (let linea of cuentaSeleccionada.lineasDeCuentas) {
			let prod;
			for (let producto of catalogo.productos) {
				if (linea.idProducto == producto.idProducto) prod = producto;
			}

			let fila = tabla.insertRow();
			let td = document.createElement("td");
			let suma = document.createElement("input");
			suma.setAttribute("type", "button");
			suma.setAttribute("class", "boton");
			suma.setAttribute("name", "suma");
			let resta = suma.cloneNode();
			suma.setAttribute("value", "+");
			resta.setAttribute("value", "-");
			td.append(suma);
			td.append(resta);
			fila.append(td);
			td = td.cloneNode();
			td.innerHTML = "";
			td.textContent = linea.unidades;
			fila.append(td);
			td = td.cloneNode();
			td.textContent = prod.idProducto;
			fila.append(td);
			td = td.cloneNode();
			td.textContent =
				prod.nombreProducto +
				" (ud: " +
				Math.round(prod.precioUnidad * 100) / 100 +
				"€)";
			fila.append(td);
			td = td.cloneNode();
			td.textContent =
				Math.round(prod.precioUnidad * linea.unidades * 100) / 100 + "€";
			fila.append(td);
		}
	}
}

function teclaPulsada(event) {
	let lineaYaIntroducida = false;

	for (let linea of cuentaSeleccionada.lineasDeCuentas)
		if (productoSeleccionado.idProducto == linea.idProducto) {
			lineaYaIntroducida = true;
			alert(
				"Este producto ya se ha introducido anteriormente en esta cuenta, por favor use las teclas '+' y '-' para modificar las unidades de los productos"
			);
		}

	if (event.target.getAttribute("class") == "tecla") {
		let num = event.target.getAttribute("value");
		let mesas = document.getElementsByClassName("mesa");
		for (let mesa of mesas) {
			if (mesa.textContent == gestor.mesaActual)
				mesa.setAttribute("class", "mesa ocupada");
		}
		cuentaSeleccionada.pagada = false;
		let encontrado = false;

		for (let linea of cuentaSeleccionada.lineasDeCuentas) {
			if (productoSeleccionado.idProducto == linea.idProducto) {
				linea.unidades = parseInt(num);
				encontrado = true;
			}
		}
		if (!encontrado) {
			let linea = new LineaCuenta(
				productoSeleccionado.idProducto,
				parseInt(num)
			);
			cuentaSeleccionada.lineasDeCuentas.push(linea);
		}

		cambiaCuenta(gestor.mesaActual);
	}
}

function cambioUnidades(event) {
	let selec = event.target;
	let linea;
	if (selec.getAttribute("name") == "suma") {
		let id = selec.parentElement.parentElement.cells[2].textContent;
		for (let lin of cuentaSeleccionada.lineasDeCuentas) {
			if (lin.idProducto == id) linea = lin;
		}

		if (selec.value == "+") linea.unidades++;
		else if (selec.value == "-") {
			linea.unidades--;
			if (linea.unidades == 0) cuentaSeleccionada.lineasDeCuentas.pop(linea);
		}
		//No se si esta feo refrescar el DOM entero de la cuenta pero no me voy a comer la cabeza
		cambiaCuenta(gestor.mesaActual);
	} else if (selec.getAttribute("id") == "pagar") pagamosCuenta();
}

function anadirProdCat() {
	listaCategorias = ["Bebidas", "Tostadas", "Bollería"];

	catalogo.addProducto(1, "Café con leche", 0.95, 0);
	catalogo.addProducto(2, "Té", 1.05, 0);
	catalogo.addProducto(3, "Cola-cao", 1.35, 0);
	catalogo.addProducto(4, "Chocolate a la taza", 1.95, 0);
	catalogo.addProducto(5, "Media con aceite", 1.25, 1);
	catalogo.addProducto(6, "Entera con aceite", 1.95, 1);
	catalogo.addProducto(7, "Media con aceite y jamón", 1.95, 1);
	catalogo.addProducto(8, "Entera con aceite y jamón", 2.85, 1);
	catalogo.addProducto(9, "Media con mantequilla", 1.15, 1);
	catalogo.addProducto(10, "Entera con mantequilla", 1.75, 1);
	catalogo.addProducto(11, "Media con manteca colorá", 1.45, 1);
	catalogo.addProducto(12, "Entera con manteca colorá", 2.15, 1);
	catalogo.addProducto(13, "Croissant", 0.95, 2);
	catalogo.addProducto(14, "Napolitana de chocolate", 1.45, 2);
	catalogo.addProducto(15, "Caracola de crema", 1.65, 2);
	catalogo.addProducto(16, "Caña de chocolate", 1.35, 2);
}

function pagamosCuenta() {
	cuentaSeleccionada.pagada = true;
	cuentaSeleccionada.lineasDeCuentas = new Array();

	let mesas = document.getElementsByClassName("mesa");
	for (let mesa of mesas) {
		if (mesa.textContent == gestor.mesaActual)
			mesa.setAttribute("class", "mesa libre");
	}

	cambiaCuenta(gestor.mesaActual);
}
