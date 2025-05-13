import mongoose from 'mongoose';
import Review from '../model/Review.js';
import Product from '../model/Product.js';

// Create or Update Review
export const createOrUpdateReview = async (req, res) => {
  try {
    // console.log('Incoming review body:', req.body);

    const { productId, rating, comment } = req.body;

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!productId || !rating || !comment) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    if (typeof rating !== 'number') {
      return res.status(400).json({ message: 'Rating must be a number' });
    }

    let review = await Review.findOne({ product: productId, user: req.user._id });

    if (review) {
      // Update existing review
      review.rating = rating;
      review.comment = comment;
      await review.save();
    } else {
      // Create new review
      review = await Review.create({
        product: productId,
        user: req.user._id,
        rating,
        comment,
      });
    }

    const allReviews = await Review.find({ product: productId });
    const ratingsAverage = (
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
    ).toFixed(1);

    await Product.findByIdAndUpdate(productId, {
      ratingsAverage,
      ratingsCount: allReviews.length,
    });

    res.status(200).json({ message: 'Review saved successfully', review });
  } catch (error) {
    console.error('Error saving review:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all reviews for a product
export const getReviewsByProduct = async (req, res) => {
  try {
    const product = new mongoose.Types.ObjectId(req.params.productId);
    // console.log('Review request body:', req.body);
    
    const reviews = await Review.find({ product: product })
      .populate("user", "name profileImage");

    res.status(200).json(reviews); // ✅ This should be "reviews", not "review"
  } catch (err) {
    console.error("Error fetching reviews:", err); // Optional: logs the error
    res.status(500).json({ message: "Failed to get reviews", error: err.message });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  try {
    // Ensure req.user is populated (user is authenticated)
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    console.log('Authenticated User ID:', req.user._id);
    console.log('Review ID:', req.params.id);

    const review = await Review.findOne({ _id: req.params.id });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
   

    // Check if the authenticated user is the owner of the review
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to delete this review' });
    }

    // Delete the review if it exists and the user is the owner
    await review.deleteOne();

    res.status(200).json({ message: 'Review deleted' });
  } catch (err) {
    console.error('Failed to delete review:', err);
    res.status(500).json({ message: 'Failed to delete review', error: err.message });
  }
};


