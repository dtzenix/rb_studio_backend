const prisma = require("../prismaClient");

async function createCustomer(req, res) {
  try {
    const { name, mobile, address, shortNote } = req.body;
    const customer = await prisma.customer.create({
      data: { name, mobile, address, shortNote },
    });
    res.status(201).json(customer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal" });
  }
}

async function getCustomers(req, res) {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(customers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal" });
  }
}

async function getCustomer(req, res) {
  try {
    const { id } = req.params;
    const customer = await prisma.customer.findUnique({ where: { id } });
    if (!customer) return res.status(404).json({ error: "not found" });
    res.json(customer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal" });
  }
}

async function updateCustomer(req, res) {
  try {
    const { id } = req.params;
    const { name, mobile, address, shortNote } = req.body;
    const updated = await prisma.customer.update({
      where: { id },
      data: { name, mobile, address, shortNote },
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal" });
  }
}

async function deleteCustomer(req, res) {
  try {
    const { id } = req.params;
    await prisma.customer.delete({ where: { id } });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal" });
  }
}

module.exports = {
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
};
