import express from "express";
import { handleSearch, getUserSuggestions, getLiveSuggestions } from "../controllers/suggestionController.js";
// import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/search", handleSearch);
        // search by keyword
router.get("/my-suggestions", getUserSuggestions); // get saved 

router.get("/live-suggestions", getLiveSuggestions);

export default router;
