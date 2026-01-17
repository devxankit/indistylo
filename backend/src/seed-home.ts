import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Content from "./models/content.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

const seedHomeData = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI not found");

    await mongoose.connect(uri);
    console.log("Connected to MongoDB...");

    // Clear existing content
    await Content.deleteMany({});
    console.log("Cleared existing content.");

    const homeData = [
      // Banners
      {
        type: "banner",
        data: {
          id: "b1",
          image: "https://res.cloudinary.com/dpjz0v3vz/image/upload/v1710156824/banners/hero1.jpg",
          link: "/at-home"
        },
        isActive: true
      },
      {
        type: "banner",
        data: {
          id: "b2",
          image: "https://res.cloudinary.com/dpjz0v3vz/image/upload/v1710156824/banners/hero2.jpg",
          link: "/at-salon"
        },
        isActive: true
      },
      // Categories
      {
        type: "category",
        data: {
          id: "c1",
          name: "Hair Cut",
          image: "https://res.cloudinary.com/dpjz0v3vz/image/upload/v1710156824/categories/haircut.jpg"
        },
        isActive: true
      },
      {
        type: "category",
        data: {
          id: "c2",
          name: "Facial",
          image: "https://res.cloudinary.com/dpjz0v3vz/image/upload/v1710156824/categories/facial.jpg"
        },
        isActive: true
      },
      {
        type: "category",
        data: {
          id: "c3",
          name: "Massage",
          image: "https://res.cloudinary.com/dpjz0v3vz/image/upload/v1710156824/categories/massage.jpg"
        },
        isActive: true
      },
      // Deals
      {
        type: "deal",
        data: {
          id: "d1",
          title: "Hair Transformation Deal",
          discount: "50% OFF",
          salon: {
            name: "Luxe Salon",
            location: "Indore, MP",
            distance: 2.5,
            rating: 4.8
          }
        },
        isActive: true
      },
      {
        type: "deal",
        data: {
          id: "d2",
          title: "Skin Glow Package",
          discount: "40% OFF",
          salon: {
            name: "Radiance Spa",
            location: "Vijay Nagar",
            distance: 1.2,
            rating: 4.5
          }
        },
        isActive: true
      },
      // Featured Services
      {
        type: "featuredService",
        data: {
          id: "s1",
          name: "Premium Hair Cut",
          image: "https://res.cloudinary.com/dpjz0v3vz/image/upload/v1710156824/services/haircut-premium.jpg",
          price: 499,
          duration: 45,
          salon: "Home Service"
        },
        isActive: true
      },
      // Popular Packages
      {
        type: "popularPackage",
        data: {
          id: "p1",
          title: "Bridal Glow Package",
          description: "Full facial, hair spa, and manicure.",
          image: "https://res.cloudinary.com/dpjz0v3vz/image/upload/v1710156824/packages/bridal.jpg",
          price: 2999,
          offerDetails: "Save ₹500",
          rating: 4.9,
          reviews: 124
        },
        isActive: true
      },
      // Promo
      {
        type: "promo",
        data: "https://res.cloudinary.com/dpjz0v3vz/image/upload/v1710156824/promo/summer-sale.jpg",
        isActive: true
      }
    ];

    await Content.insertMany(homeData);
    console.log("Seeded Home Page content successfully.");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedHomeData();
