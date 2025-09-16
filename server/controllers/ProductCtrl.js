const Product = require("../models/Product");

exports.createProduct = async (req, res) => {
  try {
    const { title, description, category, subcategory, variants } = req.body;

    let parsedVariants = [];
    if (variants) {
      if (typeof variants === "string") {
        parsedVariants = [JSON.parse(variants)];
      } else if (Array.isArray(variants)) {
        parsedVariants = variants.map((v) =>
          typeof v === "string" ? JSON.parse(v) : v
        );
      } else {
        parsedVariants = variants;
      }
    }

    const images = req.files
      ? req.files.map((file) => ({ url: file.path || file.filename }))
      : [];

    const product = new Product({
      title,
      description,
      category,
      subcategory,
      variants: parsedVariants,
      images,
    });

    await product.save();

    res.status(201).json(product);
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ message: "Server error creating product" });
  }
};

// Get all products (optionally add filters/pagination)
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("subcategory").lean();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching products" });
  }
};

// Get single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("subcategory")
      .lean();
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product" });
  }
};


