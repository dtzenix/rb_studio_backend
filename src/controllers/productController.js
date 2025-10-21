// src/controllers/productController.js
const prisma = require("../prismaClient");

/**
 * Create product
 */
async function createProduct(req, res) {
  try {
    const { name, category, price } = req.body;
    if (!name || !category || !price) {
      return res.status(400).json({ error: "name, category, price required" });
    }
    const product = await prisma.product.create({
      data: {
        name,
        category,
        price: price.toString(),
      },
    });
    res.status(201).json(product);
  } catch (err) {
    console.error("createProduct error:", err);
    res.status(500).json({ error: "internal" });
  }
}

/**
 * List products (optionally by category)
 */
async function getProducts(req, res) {
  try {
    const { category } = req.query;
    const where = category ? { where: { category } } : {};
    const products = await prisma.product.findMany(where);
    res.json(products);
  } catch (err) {
    console.error("getProducts error:", err);
    res.status(500).json({ error: "internal" });
  }
}

/**
 * Get single product
 */
async function getProduct(req, res) {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return res.status(404).json({ error: "not found" });
    res.json(product);
  } catch (err) {
    console.error("getProduct error:", err);
    res.status(500).json({ error: "internal" });
  }
}

/**
 * Update product
 */
async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const { name, category, price } = req.body;
    const updated = await prisma.product.update({
      where: { id },
      data: {
        name,
        category,
        price: price ? price.toString() : undefined,
      },
    });
    res.json(updated);
  } catch (err) {
    console.error("updateProduct error:", err);
    res.status(500).json({ error: "internal" });
  }
}

/**
 * Delete product
 */
async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id } });
    res.json({ ok: true });
  } catch (err) {
    console.error("deleteProduct error:", err);
    res.status(500).json({ error: "internal" });
  }
}

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
