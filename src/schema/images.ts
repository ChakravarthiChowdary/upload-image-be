import { Schema, Model, Document, model, Types } from "mongoose";

interface IImage extends Document {
  title: string;
  createdDate: Date;
  photoUrl: string;
}

const ImageSchema: Schema<IImage> = new Schema({
  title: { type: String, required: true },
  createdDate: { type: Date, required: true },
  photoUrl: { type: String, required: true },
});

ImageSchema.set("toObject", {
  getters: true,
});

const ImageModel: Model<IImage> = model("Image", ImageSchema);

export default ImageModel;
