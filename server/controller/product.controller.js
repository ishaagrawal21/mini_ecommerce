const productModel = require("../model/ProductModel");
const Category = require("../model/CategoryModel");
const { handleFileUpload } = require("../utils/fileUpload");

// Helper function to generate full image URL
const getFullImageURL = (imageURL) => {
  if (!imageURL) return "";
  if (imageURL.startsWith("http://")) {
    return imageURL;
  }
  // Use http for localhost
  const protocol = process.env.PROTOCOL || "http";
  const host = process.env.HOST || "localhost";
  const port = process.env.PORT || 5000;
  const baseURL = process.env.BASE_URL || `${protocol}://${host}:${port}`;
  return `${baseURL}${imageURL}`;
};

// Helper function to populate image URLs in product results
const populateImageURLs = (products) => {
  if (Array.isArray(products)) {
    return products.map(product => ({
      ...product.toObject ? product.toObject() : product,
      imageURL: getFullImageURL(product.imageURL)
    }));
  } else if (products) {
    return {
      ...products.toObject ? products.toObject() : products,
      imageURL: getFullImageURL(products.imageURL)
    };
  }
  return products;
};

// GET ALL PRODUCTS

const getProducts = async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice } = req.query;

    let filter = {};

    if (q) {
      filter.name = { $regex: q, $options: "i" };
    }

    if (category) {
      // Category should be ObjectId
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        filter.category = category;
      }
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const result = await productModel.find(filter).populate("category", "name");
    const productsWithFullURLs = populateImageURLs(result);

    return res.status(200).send({ message: "success", result: productsWithFullURLs });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

// GET SINGLE PRODUCT

const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await productModel.findById(id).populate("category", "name");

    if (!result) return res.status(404).send({ message: "Product not found" });

    const productWithFullURL = populateImageURLs(result);
    return res.status(200).send({ message: "success", result: productWithFullURL });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

// CREATE PRODUCT

const createProduct = async (req, res) => {
  try {
    let productData = {};
    let fileData = null;

    // Check if request has file upload
    if (req.headers["content-type"]?.includes("multipart/form-data")) {
      const { fields, file } = await handleFileUpload(req);
      const categoryId = fields.category;
      
      // Validate category ObjectId
      if (!categoryId) {
        return res.status(400).send({ message: "Category is required" });
      }
      
      if (!categoryId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).send({ message: "Invalid category ID" });
      }

      // express-fileupload puts fields directly in req.body as strings
      const name = fields.name || req.body?.name;
      const description = fields.description || req.body?.description;
      const price = fields.price || req.body?.price;

      // Validate required fields
      if (!name || !description || price === undefined || price === null) {
        return res.status(400).send({ message: "Name, description, and price are required" });
      }

      productData = {
        name: String(name).trim(),
        description: String(description).trim(),
        price: Number(price),
        category: categoryId,
        imageURL: file ? file.path : (fields.imageURL || req.body?.imageURL || ""),
      };
      fileData = file;
    } else {
      productData = { ...req.body };
      
      // Validate category ObjectId
      if (!productData.category) {
        return res.status(400).send({ message: "Category is required" });
      }
      
      if (!productData.category.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).send({ message: "Invalid category ID" });
      }
    }

    const result = await productModel.create(productData);
    await result.populate("category", "name");
    const productWithFullURL = populateImageURLs(result);

    return res.status(200).send({ message: "Product created", result: productWithFullURL });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

// UPDATE PRODUCT

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // First, check if product exists
    const existingProduct = await productModel.findById(id);
    if (!existingProduct) {
      return res.status(404).send({ message: "Product not found" });
    }

    let productData = {};
    let fileData = null;

    // Check if request has file upload
    if (req.headers["content-type"]?.includes("multipart/form-data")) {
      const { fields, file } = await handleFileUpload(req);
      const categoryId = fields.category || req.body.category;
      
      // Validate category ObjectId
      if (!categoryId) {
        return res.status(400).send({ message: "Category is required" });
      }
      
      if (!categoryId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).send({ message: "Invalid category ID" });
      }

      // Handle fields - express-fileupload puts fields in req.body as strings
      const name = fields.name || req.body?.name;
      const description = fields.description || req.body?.description;
      const price = fields.price || req.body?.price;

      // Validate required fields
      if (!name || !description || price === undefined || price === null) {
        return res.status(400).send({ message: "Name, description, and price are required" });
      }

      productData = {
        name: String(name).trim(),
        description: String(description).trim(),
        price: Number(price),
        category: categoryId,
      };
      
      if (file) {
        productData.imageURL = file.path;
      } else {
        // Always preserve existing imageURL if no new file is uploaded
        productData.imageURL = existingProduct.imageURL || "";
      }
      fileData = file;
    } else {
      productData = { ...req.body };
      
      // Validate category ObjectId
      if (!productData.category) {
        return res.status(400).send({ message: "Category is required" });
      }
      
      if (!productData.category.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).send({ message: "Invalid category ID" });
      }
      
      // Always preserve existing imageURL if not provided in update
      if (!productData.imageURL) {
        productData.imageURL = existingProduct.imageURL || "";
      }
    }

    const result = await productModel.findByIdAndUpdate(id, productData, {
      new: true,
      runValidators: true,
    }).populate("category", "name");

    if (!result) {
      return res.status(404).send({ message: "Product not found or update failed" });
    }

    const productWithFullURL = populateImageURLs(result);
    return res.status(200).send({ message: "Product updated", result: productWithFullURL });
  } catch (error) {
    console.log("Update error:", error);
    return res.status(500).send({ message: "Internal Server Error", error: error.message });
  }
};

// DELETE PRODUCT

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await productModel.findByIdAndDelete(id);

    if (!result) return res.status(404).send({ message: "Product not found" });

    return res.status(200).send({ message: "Product deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

// EXPORT ALL FUNCTIONS
module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
