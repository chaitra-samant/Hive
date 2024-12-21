import mongoose from "mongoose";

const { Schema, model } = mongoose;

const documentSchema = new Schema({
  _id: String,
  data: Object,
});

const Document = model("Document", documentSchema);

export default Document;
