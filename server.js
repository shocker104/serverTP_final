const express = require("express");
const fs = require("fs").promises;

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log(
    `[${new Date()}] req_method: ${req.method} url: ${req.originalUrl}`,
  );
  next();
});

app.get("/", (req, res) => {
  res.json({ message: "Bienvenido a la taberna del nerd" });
});

app.use((req, res) => {
  res.status(404).json({ message: "Pagina no encontrada" });
});

app.listen(PORT, () => {
  console.log(`Servidor esuchando en el puerto ${PORT}`);
});
