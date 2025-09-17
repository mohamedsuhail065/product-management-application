const express = require("express");
const multer = require("multer");
const {
  createProduct,
  getProducts,
  getProductById,
  toggleWishlist,
  getWishlist,
} = require("../controllers/ProductCtrl");
const auth = require("../Middleware/auth");

const productRouter = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/"); 
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

productRouter.post("/", upload.array("images", 5), createProduct);
productRouter.get("/", getProducts);
productRouter.get("/wishlist", auth, getWishlist);
productRouter.get("/:id", getProductById);
productRouter.patch("/:id/wishlist",auth,toggleWishlist)



module.exports = productRouter;
