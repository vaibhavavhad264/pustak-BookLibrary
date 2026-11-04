const express = require("express");
const cors = require("cors");
const bookRoutes = require("./routes/bookRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// simple request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${Date.now() - start}ms`);
  });
  next();
});

app.get("/", (req, res) => {
  res.json({ name: "Pustak API", endpoints: "/books" });
});

app.use("/books", bookRoutes);

// unknown route
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// anything that throws ends up here
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Server error" });
});

app.listen(PORT, () => {
  console.log(`Pustak API running at http://localhost:${PORT}`);
});
