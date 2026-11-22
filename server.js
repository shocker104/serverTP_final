const express = require("express");
const fs = require("fs").promises;

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log(
    `[${new Date()}] req_method: ${req.method} - url: ${req.originalUrl}`,
  );
  next();
});

app.get("/", (req, res) => {
  res.json({ message: "Bienvenido a la taberna del nerd" });
});

app.get("/recursos", async (req, res) => {
  try {
    const data = await fs.readFile("articulos.json", "utf-8");
    const articulos = JSON.parse(data);
    res.json(articulos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al realizar la petición" });
  }
});

app.get("/books/:id", async (req, res) => {
  try {
    const idParams = req.params.id;
    const id = parseInt(idParams, 10);

    // validaciones: id debe ser un número, entero positivo
    if (Number.isNaN(id) || id <= 0) {
      return res.status(400).send("El id es inválido.");
    }

    // Leer el archivo de la lista de libros
    const data = await fs.readFile("books.json", "utf-8");
    const books = JSON.parse(data);

    // Buscamos el libro por id
    const book = books.find((libro) => libro.id === id);
    // Validamos que no se encuentre un libro con dicho id
    if (!book) {
      return res.status(404).send("No se encontró un libro con dicho id");
    }
    // Devolvemos el libro
    res.json(book);
  } catch (error) {}
});

app.get("/recursos/buscar", async (req, res) => {
  try {
    const data = await fs.readFile("articulos.json", "utf-8");
    const articulos = JSON.parse(data);
    const clave = req.query.articulo;
    if (clave) {
      const filteredArticulos = articulos.filter(
        (articulo) => articulo.articulo.toLowerCase() === clave.toLowerCase(),
      );
      if (filteredArticulos.length === 0) {
        return res.status(404).json({ message: "Categoría no encontrada" });
      }
      res.json(filteredArticulos);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al realizar la petición" });
  }
});

app.use((req, res) => {
  res.status(404).json({ message: "Pagina no encontrada" });
});

app.listen(PORT, () => {
  console.log(`Servidor esuchando en el puerto ${PORT}`);
});
