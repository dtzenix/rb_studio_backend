// prisma/seed.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const crypto = require("crypto");

async function main() {
  console.log("Seeding products...");

  const products = [
    // Hair SPA
    { name: "Oil Massage", category: "Hair SPA", price: "400" },
    { name: "Oil Massage With Steaming", category: "Hair SPA", price: "500" },
    { name: "Hair SPA", category: "Hair SPA", price: "500" },

    // Hair Care under Hair SPA
    { name: "Baby Hair Cuts", category: "Hair SPA", price: "200" },
    { name: "Dora Cut", category: "Hair SPA", price: "250" },
    { name: "Bob Cut", category: "Hair SPA", price: "300" },
    { name: "Mushroom Cut", category: "Hair SPA", price: "350" },
    { name: "Straight Cut (Medium)", category: "Hair SPA", price: "150" },
    { name: "U Cut (Medium)", category: "Hair SPA", price: "200" },
    { name: "Straight Cut (Long)", category: "Hair SPA", price: "200" },
    { name: "U Cut (Long)", category: "Hair SPA", price: "300" },
    { name: "Layer (Medium Length)", category: "Hair SPA", price: "500" },
    { name: "Layer (Long)", category: "Hair SPA", price: "800" },
    { name: "V Cut", category: "Hair SPA", price: "500" },
    { name: "Bangs", category: "Hair SPA", price: "150" },
    { name: "Split Ends", category: "Hair SPA", price: "500" },

    // Hair Coloring under Hair SPA
    { name: "Black Dye (One Packet)", category: "Hair SPA", price: "100" },
    { name: "Hair Colouring", category: "Hair SPA", price: "700" },
    { name: "Henna Apply (Medium Hair)", category: "Hair SPA", price: "500" },
    { name: "Henna Apply (Long Hair)", category: "Hair SPA", price: "800" },

    // Skin Care & Facials
    { name: "Basic Clean Up", category: "Skin Care & Facials", price: "300" },
    { name: "D. Tan", category: "Skin Care & Facials", price: "400" },
    {
      name: "Face Bleach (Herbal)",
      category: "Skin Care & Facials",
      price: "500",
    },
    { name: "Neck Bleach", category: "Skin Care & Facials", price: "300" },
    { name: "Herbal Facial", category: "Skin Care & Facials", price: "400" },
    {
      name: "Fruit Facial (Basic)",
      category: "Skin Care & Facials",
      price: "500",
    },
    {
      name: "Fruit Facial (Advance)",
      category: "Skin Care & Facials",
      price: "800",
    },
    { name: "Tan Facial", category: "Skin Care & Facials", price: "800" },
    { name: "Lotus Facial", category: "Skin Care & Facials", price: "1500" },
    {
      name: "Glow Facial (Basic)",
      category: "Skin Care & Facials",
      price: "600",
    },
    {
      name: "Bridal Glow Facial",
      category: "Skin Care & Facials",
      price: "1000",
    },
    {
      name: "Tea Tree Facial (Dimple Care)",
      category: "Skin Care & Facials",
      price: "800",
    },
    {
      name: "Acne & Pigmentation Treatment",
      category: "Skin Care & Facials",
      price: "1500",
    },
    {
      name: "Gold Diamond Facial",
      category: "Skin Care & Facials",
      price: "1500",
    },
    {
      name: "Shahnaz Husain Facial",
      category: "Skin Care & Facials",
      price: "1500",
    },
    {
      name: "Aroma Magic Facial",
      category: "Skin Care & Facials",
      price: "800",
    },
    {
      name: "Party Make Up (Basic)",
      category: "Skin Care & Facials",
      price: "1500",
    },
    {
      name: "Bridal Make Up (Basic)",
      category: "Skin Care & Facials",
      price: "6000",
    },
    {
      name: "Bridal Make Up (HD)",
      category: "Skin Care & Facials",
      price: "10000",
    },

    // Waxing & Threading
    { name: "Eyebrow Threading", category: "Waxing & Threading", price: "60" },
    { name: "Upper Lips", category: "Waxing & Threading", price: "30" },
    { name: "Chin Threading", category: "Waxing & Threading", price: "50" },
    {
      name: "Full Face Threading",
      category: "Waxing & Threading",
      price: "150",
    },
    { name: "Upper Lips Waxing", category: "Waxing & Threading", price: "50" },
    {
      name: "Upper Lips & Chin Waxing",
      category: "Waxing & Threading",
      price: "150",
    },
    { name: "Face Waxing", category: "Waxing & Threading", price: "200" },
    { name: "Half Hand Waxing", category: "Waxing & Threading", price: "250" },
    { name: "Full Hand Waxing", category: "Waxing & Threading", price: "400" },
    { name: "Underarms Waxing", category: "Waxing & Threading", price: "150" },
    { name: "Half Leg Waxing", category: "Waxing & Threading", price: "300" },
    { name: "Full Leg Waxing", category: "Waxing & Threading", price: "600" },

    // Hand and Feet Care
    { name: "Manicure (Basic)", category: "Nails", price: "400" },
    { name: "Manicure (Advance)", category: "Nails", price: "600" },
    { name: "Pedicure (Basic)", category: "Nails", price: "400" },
    { name: "Pedicure (Advance)", category: "Nails", price: "700" },
    { name: "Feet Cleaning", category: "Nails", price: "300" },
    { name: "Hand Bleach (Herbal)", category: "Nails", price: "300" },

    // Saree Draping
    { name: "Saree Preplatting", category: "Saree Draping", price: "300" },
    { name: "Saree Draping (Basic)", category: "Saree Draping", price: "500" },
    {
      name: "Saree Draping & Hair Styling",
      category: "Saree Draping",
      price: "1000",
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { id: p.id || crypto.randomUUID() }, // must be unique
      update: {},
      create: {
        name: p.name,
        category: p.category,
        price: p.price,
      },
    });
  }

  console.log("Products seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
