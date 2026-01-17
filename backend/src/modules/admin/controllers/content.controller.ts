import type { Request, Response, NextFunction } from "express";
import Content from "../../../models/content.model.js";

// @desc    Get all active content for public display
// @route   GET /api/admin/content
// @access  Public
export const getPublicContent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const banners = await Content.find({ type: "banner", isActive: true });
    const categories = await Content.find({ type: "category", isActive: true });
    const referral = await Content.findOne({
      type: "referral",
      isActive: true,
    });
    const deals = await Content.find({ type: "deal", isActive: true });
    const featuredServices = await Content.find({
      type: "featuredService",
      isActive: true,
    });
    const salonFeaturedServices = await Content.find({
      type: "salonFeaturedService",
      isActive: true,
    });
    const promo = await Content.findOne({ type: "promo", isActive: true });

    res.status(200).json({
      banners: banners.map((b) => ({
        _id: b._id,
        ...b.data,
        active: b.isActive,
      })),
      categories: categories.map((c) => ({
        _id: c._id,
        ...c.data,
        active: c.isActive,
      })),
      referral: referral
        ? { _id: referral._id, ...referral.data, active: referral.isActive }
        : null,
      deals: deals.map((d) => ({ _id: d._id, ...d.data, active: d.isActive })),
      featuredServices: featuredServices.map((f) => ({
        _id: f._id,
        ...f.data,
        active: f.isActive,
      })),
      salonFeaturedServices: salonFeaturedServices.map((s) => ({
        _id: s._id,
        ...s.data,
        active: s.isActive,
      })),
      promoBanner: promo?.data || "",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all content items by type
// @route   GET /api/admin/content/:type
// @access  Private/Admin (or Public depending on use case)
export const getContentByType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const content = await Content.find({ type: req.params.type as string });
    res.status(200).json(content);
  } catch (error) {
    next(error);
  }
};

// @desc    Add new content item
// @route   POST /api/admin/content
// @access  Private/Admin
export const addContent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { type, data, isActive } = req.body;
    const content = await Content.create({ type, data, isActive });
    res.status(201).json(content);
  } catch (error) {
    next(error);
  }
};

// @desc    Update content item
// @route   PUT /api/admin/content/:id
// @access  Private/Admin
export const updateContent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const content = await Content.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!content) {
      res.status(404);
      return next(new Error("Content not found"));
    }
    res.status(200).json(content);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete content item
// @route   DELETE /api/admin/content/:id
// @access  Private/Admin
export const deleteContent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const content = await Content.findByIdAndDelete(req.params.id);
    if (!content) {
      res.status(404);
      return next(new Error("Content not found"));
    }
    res.status(200).json({ message: "Content deleted" });
  } catch (error) {
    next(error);
  }
};
