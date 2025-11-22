const Category = require("../model/CategoryModel");

// CREATE CATEGORY
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name)
      return res.status(400).send({ message: "Category name is required" });

    const exists = await Category.findOne({ name });
    if (exists)
      return res.status(400).send({ message: "Category already exists" });

    const result = await Category.create({ name, description: description || "" });

    return res.status(200).send({
      message: "Category created successfully",
      result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

// GET ALL CATEGORIES
const getCategories = async (req, res) => {
  try {
    const { q } = req.query;
    let filter = {};
    
    if (q) {
      filter.name = { $regex: q, $options: "i" };
    }
    
    const result = await Category.find(filter).sort({ createdAt: -1 });

    return res.status(200).send({ message: "success", result });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

// GET SINGLE CATEGORY
const getCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Category.findById(id);

    if (!result) return res.status(404).send({ message: "Category not found" });

    return res.status(200).send({ message: "success", result });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

// UPDATE CATEGORY
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updated)
      return res.status(404).send({ message: "Category not found" });

    return res.status(200).send({
      message: "Category updated successfully",
      updated,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

// DELETE CATEGORY
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Category.findByIdAndDelete(id);

    if (!deleted)
      return res.status(404).send({ message: "Category not found" });

    return res.status(200).send({ message: "Category deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
