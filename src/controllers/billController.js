// src/controllers/billController.js
const prisma = require("../prismaClient");

/**
 * Create bill (transactional)
 * Body:
 * {
 *  date?, customerName, customerMobile, customerAddress, remarks,
 *  items: [{ productId?, description, qty, unitPrice }],
 *  payment?: { amount, method, note }
 * }
 */
async function createBill(req, res) {
  const body = req.body;
  if (
    !body.customerName ||
    !Array.isArray(body.items) ||
    body.items.length === 0
  ) {
    return res.status(400).json({ error: "customerName and items required" });
  }

  // compute billAmount
  let subtotal = 0;
  for (const it of body.items) {
    const qty = Number(it.qty || 1);
    const unit = Number(it.unitPrice);
    subtotal += qty * unit;
  }
  const billAmount = subtotal.toFixed(2);

  try {
    const createdBill = await prisma.$transaction(async (tx) => {
      // Create bill
      const bill = await tx.bill.create({
        data: {
          date: body.date ? new Date(body.date) : undefined,
          customerName: body.customerName,
          customerMobile: body.customerMobile,
          customerAddress: body.customerAddress,
          remarks: body.remarks,
          billAmount: billAmount.toString(),
        },
      });

      // Prepare items
      const itemsData = body.items.map((it) => ({
        billId: bill.id,
        productId: it.productId || null,
        description: it.description || null,
        qty: it.qty || 1,
        unitPrice: it.unitPrice.toString(),
        totalPrice: (Number(it.qty || 1) * Number(it.unitPrice))
          .toFixed(2)
          .toString(),
      }));

      // Insert items
      await tx.billItem.createMany({ data: itemsData });

      // Optionally record payment
      if (body.payment) {
        await tx.payment.create({
          data: {
            billId: bill.id,
            amount: body.payment.amount.toString(),
            method: body.payment.method,
            note: body.payment.note,
          },
        });
      }

      return bill;
    });

    res.status(201).json(createdBill);
  } catch (err) {
    console.error("createBill error:", err);
    res.status(500).json({ error: "internal" });
  }
}

/**
 * List bills (with items & payments)
 */
async function getBills(req, res) {
  try {
    const bills = await prisma.bill.findMany({
      include: { items: true, payments: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(bills);
  } catch (err) {
    console.error("getBills error:", err);
    res.status(500).json({ error: "internal" });
  }
}

/**
 * Get single bill by id (with items + payments)
 */
async function getBill(req, res) {
  try {
    const { id } = req.params;
    const bill = await prisma.bill.findUnique({
      where: { id },
      include: { items: true, payments: true },
    });
    if (!bill) return res.status(404).json({ error: "not found" });
    res.json(bill);
  } catch (err) {
    console.error("getBill error:", err);
    res.status(500).json({ error: "internal" });
  }
}

/**
 * Update bill (top-level fields)
 * Editing items would require additional logic (e.g., delete/create items) — keep simple now
 */
async function updateBill(req, res) {
  try {
    const { id } = req.params;
    const {
      customerName,
      customerMobile,
      customerAddress,
      remarks,
      billAmount,
    } = req.body;
    const updated = await prisma.bill.update({
      where: { id },
      data: {
        customerName,
        customerMobile,
        customerAddress,
        remarks,
        billAmount: billAmount ? billAmount.toString() : undefined,
      },
    });
    res.json(updated);
  } catch (err) {
    console.error("updateBill error:", err);
    res.status(500).json({ error: "internal" });
  }
}

/**
 * Delete bill (cascade deletes items & payments)
 */
async function deleteBill(req, res) {
  try {
    const { id } = req.params;
    await prisma.bill.delete({ where: { id } });
    res.json({ ok: true });
  } catch (err) {
    console.error("deleteBill error:", err);
    res.status(500).json({ error: "internal" });
  }
}

module.exports = {
  createBill,
  getBills,
  getBill,
  updateBill,
  deleteBill,
};
