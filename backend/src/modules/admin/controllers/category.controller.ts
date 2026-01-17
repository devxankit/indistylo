import type { Request, Response, NextFunction } from "express";
import HeaderCategory from "../../../models/headerCategory.model.js";
import Subcategory from "../../../models/subcategory.model.js";

// ==================== PUBLIC ENDPOINTS ====================

// @desc    Get subcategories for public user app (grouped by header)
// @route   GET /api/public/categories/subcategories?gender=MALE|FEMALE
// @access  Public
export const getPublicSubcategories = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { gender, type } = req.query;
        const categoryType = (type as string) || "SALON";

        if (!gender || !["MALE", "FEMALE"].includes(gender as string)) {
            res.status(400);
            return next(new Error("Please provide a valid gender (MALE or FEMALE)"));
        }

        const headers = await HeaderCategory.find({ type: categoryType }).sort({ order: 1 }).lean();

        const result = await Promise.all(
            headers.map(async (header) => {
                const subcategories = await Subcategory.find({
                    headerCategoryId: header._id,
                    gender: gender as string,
                })
                    .sort({ order: 1 })
                    .lean();

                return {
                    _id: header._id,
                    headerName: header.name,
                    headerOrder: header.order || 0,
                    subcategories: subcategories.map((sub) => ({
                        _id: sub._id,
                        name: sub.name,
                        image: sub.image,
                    })),
                };
            })
        );

        // Filter out headers with no subcategories for. the given gender
        const filteredResult = result.filter((h) => h.subcategories.length > 0);

        res.status(200).json(filteredResult);
    } catch (error) {
        next(error);
    }
};

// ==================== HEADER CATEGORY CONTROLLERS ====================

// @desc    Get all header categories
// @route   GET /api/admin/categories/headers
// @access  Private/Admin
export const getAllHeaderCategories = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { type } = req.query;
        const query: any = {};
        if (type) {
            query.type = type;
        }
        const categories = await HeaderCategory.find(query).sort({ order: 1 });
        res.status(200).json(categories);
    } catch (error) {
        next(error);
    }
};

// @desc    Create header category
// @route   POST /api/admin/categories/headers
// @access  Private/Admin
export const createHeaderCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { name, order, type } = req.body;

        const existing = await HeaderCategory.findOne({
            name: { $regex: new RegExp(`^${name}$`, "i") },
            type: type || "SALON",
        });
        if (existing) {
            res.status(400);
            return next(new Error(`Header category with name "${name}" already exists for type ${type || "SALON"}`));
        }

        const category = await HeaderCategory.create({ name, order: order || 0, type: type || "SALON" });
        res.status(201).json(category);
    } catch (error) {
        next(error);
    }
};

// @desc    Update header category
// @route   PUT /api/admin/categories/headers/:id
// @access  Private/Admin
export const updateHeaderCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const category = await HeaderCategory.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!category) {
            res.status(404);
            return next(new Error("Header category not found"));
        }
        res.status(200).json(category);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete header category
// @route   DELETE /api/admin/categories/headers/:id
// @access  Private/Admin
export const deleteHeaderCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Check for subcategories
        const subcategoryCount = await Subcategory.countDocuments({
            headerCategoryId: req.params.id as string,
        });
        if (subcategoryCount > 0) {
            res.status(400);
            return next(
                new Error(
                    `Cannot delete. This category has ${subcategoryCount} subcategories.`
                )
            );
        }

        const category = await HeaderCategory.findByIdAndDelete(req.params.id);
        if (!category) {
            res.status(404);
            return next(new Error("Header category not found"));
        }
        res.status(200).json({ message: "Header category deleted" });
    } catch (error) {
        next(error);
    }
};

// ==================== SUBCATEGORY CONTROLLERS ====================

// @desc    Get all subcategories (with optional gender filter)
// @route   GET /api/admin/categories/subcategories?gender=MALE
// @access  Private/Admin
export const getAllSubcategories = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { gender, type } = req.query;
        const query: any = {};
        if (gender) {
            query.gender = gender;
        }
        if (type) {
            query.type = type;
        }
        const subcategories = await Subcategory.find(query)
            .populate("headerCategoryId", "name")
            .sort({ order: 1 });
        res.status(200).json(subcategories);
    } catch (error) {
        next(error);
    }
};

// @desc    Create subcategory
// @route   POST /api/admin/categories/subcategories
// @access  Private/Admin
export const createSubcategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { name, headerCategoryId, gender, image, order, type } = req.body;

        // Verify header category exists
        const header = await HeaderCategory.findById(headerCategoryId);
        if (!header) {
            res.status(400);
            return next(new Error("Invalid header category ID"));
        }

        // Check for duplicate name under same header, gender and type
        const existing = await Subcategory.findOne({
            name: { $regex: new RegExp(`^${name}$`, "i") },
            headerCategoryId,
            gender,
            type: type || "SALON",
        });
        if (existing) {
            res.status(400);
            return next(
                new Error(
                    "Subcategory with this name already exists for this gender, header and type"
                )
            );
        }

        const subcategory = await Subcategory.create({
            name,
            headerCategoryId,
            gender,
            image,
            order: order || 0,
            type: type || "SALON",
        });

        res.status(201).json(subcategory);
    } catch (error) {
        next(error);
    }
};

// @desc    Update subcategory
// @route   PUT /api/admin/categories/subcategories/:id
// @access  Private/Admin
export const updateSubcategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Verify header category if provided
        if (req.body.headerCategoryId) {
            const header = await HeaderCategory.findById(req.body.headerCategoryId);
            if (!header) {
                res.status(400);
                return next(new Error("Invalid header category ID"));
            }
        }

        const subcategory = await Subcategory.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!subcategory) {
            res.status(404);
            return next(new Error("Subcategory not found"));
        }
        res.status(200).json(subcategory);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete subcategory
// @route   DELETE /api/admin/categories/subcategories/:id
// @access  Private/Admin
export const deleteSubcategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const subcategory = await Subcategory.findByIdAndDelete(req.params.id);
        if (!subcategory) {
            res.status(404);
            return next(new Error("Subcategory not found"));
        }
        res.status(200).json({ message: "Subcategory deleted" });
    } catch (error) {
        next(error);
    }
};
