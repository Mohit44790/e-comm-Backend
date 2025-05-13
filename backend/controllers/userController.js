import Product from "../model/Product.js";
import User from "../model/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { uploadToCloudinaryDirect } from "../middlewares/cloudinaryMiddleware.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExist = await User.findOne({ email });
    if (userExist) return res.status(400).json({ message: "User already exists" });

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashPassword,
    });

    return res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logoutUser = async (req, res) => {
    try {
      // Clear the token cookie
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
  
      return res.status(200).json({
        success: true,
        message: "User logged out successfully",
      });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
  



export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true });
    res.status(200).json({ message: "Profile updated", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: req.body },
      { new: true }
    ).select("-password");
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: "Failed to update profile" });
  }
};

export const updateProfileImage = async (req, res) => {
  try {
    let imageUrl = "";

    if (req.file) {
      const result = await uploadToCloudinaryDirect(req.file, 'users');
      imageUrl = result.secure_url;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profileImage: imageUrl },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Profile image updated successfully",
      user,
    });
  } catch (err) {
    console.error("Update profile image error:", err);
    res.status(500).json({ error: "Failed to update profile image" });
  }
};

export const addViewedItem = async (req, res) => {
  const { userId, productId } = req.body;
  try {
    await User.updateOne(
      { _id: userId },
      { $addToSet: { viewedItems: productId } }
    );
    res.status(200).send('Item added to viewed list');
  } catch (error) {
    res.status(500).send('Error updating viewed items');
  }
};


export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { wishlist: productId } },
      { new: true }
    );
    
    res.status(200).json(user.wishlist);
  } catch (err) {
    res.status(500).json({ error: "Failed to add to wishlist" });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { wishlist: productId } },
      { new: true }
    );
    res.status(200).json(user.wishlist);
  } catch (err) {
    res.status(500).json({ error: "Failed to remove from wishlist" });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");
    res.status(200).json(user.wishlist);
  } catch (err) {
    res.status(500).json({ error: "Failed to get wishlist" });
  }
};

export const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity, colors, sizes ,images ,price} = req.body;
    

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    const name = product.name;
    const description = product.description;
    // check if product already in cart with same options
    const existingItem = user.cart.find(
      (item) =>
        item.product?.toString() === productId &&
      item.name ===name &&
        item.colors === colors &&
        item.sizes === sizes  &&
        item.price ===price &&
        item.description ===description &&
        item.images ===images
    );
    // console.log("User Cart Items:", user.cart);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({ product: productId,name, quantity, colors,description, sizes,images,price });
    }

    await user.save();

    return res.status(200).json({ success: true, message: "Product added to cart", cart: user.cart });
  } catch (error) {
    console.error("Add to cart error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message || error,
    });
  }
};


// Remove from cart
export const removeFromCart = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized: No user info" });
    }

    const userId = req.user._id;
    const productId = req.params.productId;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.cart = user.cart.filter(
      (item) => item.product && item.product.toString() !== productId
    );

    await user.save();

    res.status(200).json({ message: "Product removed from cart", cart: user.cart });
  } catch (error) {
    console.error("Error in removeFromCart:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Update cart (e.g., update quantity or size/color)
export const updateCart = async (req, res) => {
  const { productId, name,quantity, color, size  } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the product in the cart and update the quantity/color/size
    const productIndex = user.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    if (quantity) user.cart[productIndex].quantity = quantity;
    if (name) user.cart[productIndex].name = name;
    if (color) user.cart[productIndex].color = color;
    if (size) user.cart[productIndex].size = size;

    await user.save();
    res.status(200).json({ message: "Cart updated", cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Fetch the current cart
export const getCart = async (req, res) => {
  const userId = req.user.id; // The user ID from the authenticated request

  try {
    // Find the user and populate their cart with product details
    const user = await User.findById(userId).populate("cart.product");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user's cart
    res.status(200).json({ cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


// Empty the user's cart
export const emptyCart = async (req, res) => {
  const userId = req.user.id; // The user ID from the authenticated request

  try {
    // Find the user and empty their cart
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Clear the user's cart
    user.cart = [];

    await user.save();
    res.status(200).json({ message: "Cart emptied successfully", cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


export const addAddress = async (req, res) => {
  try {
    const address = req.body;
    const user = await User.findById(req.user._id);
    user.addresses.push(address);
    await user.save();
    res.status(200).json(user.addresses);
  } catch (err) {
    res.status(500).json({ error: "Failed to add address" });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const { index, address } = req.body;
    const user = await User.findById(req.user._id);
    user.addresses[index] = address;
    await user.save();
    res.status(200).json(user.addresses);
  } catch (err) {
    res.status(500).json({ error: "Failed to update address" });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { index } = req.body;
    const user = await User.findById(req.user._id);
    user.addresses.splice(index, 1);
    await user.save();
    res.status(200).json(user.addresses);
  } catch (err) {
    res.status(500).json({ error: "Failed to delete address" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ users }); // 👈 Fixed: Wrapped users inside { users }
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const blockUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isBlocked: true }, { new: true });
    res.status(200).json({ message: `User ${user.name} blocked` });
  } catch (err) {
    res.status(500).json({ error: "Failed to block user" });
  }
};

export const unblockUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isBlocked: false }, { new: true });
    res.status(200).json({ message: `User ${user.name} unblocked` });
  } catch (err) {
    res.status(500).json({ error: "Failed to unblock user" });
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: `User ${user.name} deleted successfully` });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};

// Update user role (user <-> admin)
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: "Invalid role. Must be 'user' or 'admin'." });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: `User role updated to ${user.role}` });
  } catch (err) {
    res.status(500).json({ error: "Failed to update user role" });
  }
};



