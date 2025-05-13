import mongoose from "mongoose";

const languageTranslateSchema = new mongoose.Schema({
    text: { type: String, required: true },
    targetLanguage: { type: String, required: true },
    translatedText: { type: String, required: true }
});

export default mongoose.model("LanguageTranslate", languageTranslateSchema);
