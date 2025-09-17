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

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching products" });
  }
};


exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product" });
  }
};


exports.toggleWishlist = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id; 
  const product = await Product.findById(id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  const index = product.wishlist.indexOf(userId);
  if (index === -1) {
    product.wishlist.push(userId);
  } else {
    product.wishlist.splice(index, 1);
  }
  await product.save();
  res.json({ wishlist: product.wishlist });
};


exports.getWishlist = async (req, res) => {
  const userId = req.user.id;
  console.log(userId)
  try {
    const wishlistedProducts = await Product.find({ wishlist: userId })
    res.json(wishlistedProducts);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching wishlist" });
  }
};

