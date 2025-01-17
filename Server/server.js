import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import Product from "./Models/product.model.js";

dotenv.config();

const app = express();

app.use(express.json());

app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.findById({});
    res.status(200).jsom({ success: true, data: products });
  } catch (error) {
    console.error("Error in getting products", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});
app.post("/api/products", async (req, res) => {
  const product = req.body;
  if (!product.name || !product.price || !product.image) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all the fields" });
  }

  const newProduct = new Product(product);

  try {
    await newProduct.save();
    res.status(201).json({ sucess: true, data: newProduct });
  } catch (error) {
    console.error("Error in create project", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await Product.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

app.listen(5000, () => {
  connectDB();
  console.log("Server listening on port 5000 ");
});
