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

app.get("/recurso", async (req, res) => {
  try {
    const data = await fs.readFile("articulos.json", "utf-8");
    const articulos = JSON.parse(data);
    res.json(articulos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al realizar la petición" });
  }
});

app.get("/recurso/:id", async (req, res) => {
  try {
    const idParams = req.params.id;
    const id = parseInt(idParams, 10);

    if (Number.isNaN(id) || id <= 0) {
      return res.status(400).send("El id es inválido.");
    }

    const data = await fs.readFile("articulos.json", "utf-8");
    const articulos = JSON.parse(data);

    const articulo = articulos.find((artic) => artic.id === id);
    if (!articulo) {
      return res.status(404).send("No se encontró un articulo con dicho id");
    }
    res.json(articulo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al realizar la petición" });
  }
});

app.get("/recurso/buscar", async (req, res) => {
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
