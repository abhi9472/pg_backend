// const mongoose = require('mongoose');
import mongoose from "mongoose";
const {Schema}=mongoose;

const suggestionSchema = new Schema({
  suggestion: { type: String, required: true },
});

// module.exports = mongoose.model('Suggestion', suggestionSchema);
export const Suggestion=mongoose.model('Suggestion',suggestionSchema);
