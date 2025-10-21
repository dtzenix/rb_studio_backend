// src/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const productRoutes = require("./routes/productRoutes");
const billRoutes = require("./routes/billRoutes");
const customerRoutes = require("./routes/customerRoutes");

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

/* Static simple login for single user */
app.post("/login", (req, res) => {
  const { user_name, password } = req.body;
  if (
    user_name === process.env.APP_USER_NAME &&
    password === process.env.APP_USER_PASSWORD
  ) {
    return res.json({ ok: true, user: { user_name } });
  }
  return res.status(401).json({ ok: false, message: "Invalid credentials" });
});

/* Mount routes */
app.use("/products", productRoutes);
app.use("/bills", billRoutes);
app.use("/customers", customerRoutes);

/* Health */
app.get("/health", (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
