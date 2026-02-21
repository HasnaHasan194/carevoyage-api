import mongoose from "mongoose";
import { wishlistSchema, IWishlistModel } from "../schemas/wishlist.schema";

export const wishlistDB = mongoose.model<IWishlistModel>(
  "wishlist",
  wishlistSchema
);
