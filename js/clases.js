class Producto {
  #idProducto;
  #nombreProducto;
  #precioUnidad;
  #idCategoria;

  constructor(idProd, nomProd, precio, idCat) {
    this.#idProducto = idProd;
    this.#nombreProducto = nomProd;
    this.#precioUnidad = precio;
    this.#idCategoria = idCat;
  }

  get idProducto() {
    return this.#idProducto;
  }
  set idProducto(value) {
    this.#idProducto = value;
  }
  get nombreProducto() {
    return this.#nombreProducto;
  }
  set nombreProducto(value) {
    this.#nombreProducto = value;
  }
  get precioUnidad() {
    return this.#precioUnidad;
  }
  set precioUnidad(value) {
    this.#precioUnidad = value;
  }
  get idCategoria() {
    return this.#idCategoria;
  }
  set idCategoria(value) {
    this.#idCategoria = value;
  }
}

class Catalogo {
  #productos = Array();

  addProducto(idProducto, nombreProducto, precioUnidad, idC) {
    let prod = new Producto(idProducto, nombreProducto, precioUnidad, idC);
    this.productos.push(prod);
  }

  get productos() {
    return this.#productos;
  }
  set productos(value) {
    this.#productos = value;
  }
}

class LineaCuenta {
  #unidades;
  #idProducto;

  constructor(idProducto, unidades) {
    this.#idProducto = idProducto;
    this.#unidades = unidades;
  }

  get idProducto() {
    return this.#idProducto;
  }
  set idProducto(value) {
    this.#idProducto = value;
  }
  get unidades() {
    return this.#unidades;
  }
  set unidades(value) {
    this.#unidades = value;
  }
}

class Cuenta {
  #mesa;
  #lineasDeCuentas = new Array();
  #pagada = true;

  constructor(mesa, pagada) {
    this.#mesa = mesa;
    this.#pagada = pagada;
  }

  get pagada() {
    return this.#pagada;
  }
  set pagada(value) {
    this.#pagada = value;
  }
  get lineasDeCuentas() {
    return this.#lineasDeCuentas;
  }
  set lineasDeCuentas(value) {
    this.#lineasDeCuentas = value;
  }
  get mesa() {
    return this.#mesa;
  }
  set mesa(value) {
    this.#mesa = value;
  }

  calculaCuenta(catalogo) {
    let sum = 0;

    for (let linea of this.lineasDeCuentas) {
      for (let prod of catalogo.productos) {
        if (prod.idProducto == linea.idProducto) {
          sum += prod.precioUnidad * linea.unidades;
        }
      }
    }

    return sum;
  }
}

class Gestor {
  #cuentas;
  #mesaActual = 0;

  constructor(cuentas) {
    this.#cuentas = cuentas;
  }

  get mesaActual() {
    return this.#mesaActual;
  }
  set mesaActual(value) {
    this.#mesaActual = value;
  }
  get cuentas() {
    return this.#cuentas;
  }
  set cuentas(value) {
    this.#cuentas = value;
  }
}
