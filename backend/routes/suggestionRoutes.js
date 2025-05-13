import express from "express";
import { handleSearch, getUserSuggestions, getLiveSuggestions } from "../controllers/suggestionController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/search",isAuthenticated, handleSearch);
        // search by keyword
router.get("/my-suggestions", isAuthenticated, getUserSuggestions); // get saved 

router.get("/live-suggestions", isAuthenticated, getLiveSuggestions);

export default router;
