import express from "express";
import {
    getAllHeaderCategories,
    createHeaderCategory,
    updateHeaderCategory,
    deleteHeaderCategory,
    getAllSubcategories,
    createSubcategory,
    updateSubcategory,
    deleteSubcategory,
    getPublicSubcategories,
} from "../controllers/category.controller.js";

const router = express.Router();

// Public route for user app
router.get("/public/subcategories", getPublicSubcategories);

// Header categories (protected, requires admin middleware from parent)
router.route("/headers").get(getAllHeaderCategories).post(createHeaderCategory);
router.route("/headers/:id").put(updateHeaderCategory).delete(deleteHeaderCategory);

// Subcategories (protected, requires admin middleware from parent)
router.route("/subcategories").get(getAllSubcategories).post(createSubcategory);
router.route("/subcategories/:id").put(updateSubcategory).delete(deleteSubcategory);

export default router;
