import { translateText } from "../utils/translationService.js"; // Adjust the import based on your project structure
import LanguageTranslate from "../model/languageTranslateModel.js";
export const getLanguageTranslate = async (req, res) => {
    const { text, targetLanguage } = req.body;

    try {
        const translatedText = await translateText(text, targetLanguage);
        const languageTranslate = new LanguageTranslate({
            text,
            targetLanguage,
            translatedText
        });
        await languageTranslate.save();
        res.json({ translatedText });
    } catch (error) {
        console.error("Error translating text:", error);
        res.status(500).json({ error: "Failed to translate text" });
    }
};


 // Adjust the import based on your project structure