const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const bookRoutes = require("./routes/book.routes");
const qaRoutes = require("./routes/qa.routes");
const ddrRoutes = require("./routes/ddr.routes");

const protect = require("./middleware/auth.middleware");

const app = express();

app.use(cors());
app.use(express.json());

// Public authentication routes
app.use("/api/auth", authRoutes);

 
app.use("/api/book", protect,bookRoutes);
app.use("/api/qa",protect, qaRoutes);
app.use("/api/ddr",protect, ddrRoutes);

module.exports = app;
