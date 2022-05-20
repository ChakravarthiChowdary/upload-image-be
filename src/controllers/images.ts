import { RequestHandler } from "express";
import HttpError from "../models/HttpError";
import Image from "../schema/images";

export const uploadImage: RequestHandler = async (req, res, next) => {
  try {
    let image;
    let uploadPath;
    const basicPath = "http://localhost:5000/uploads";

    if (!req.files || Object.keys(req.files).length === 0) {
      return next(new HttpError("No file uploaded", 400));
    }

    image = req.files.image;

    if (!image) {
      return next(new HttpError("No image attached with body.", 400));
    }

    const extension = image.name.split(".")[1];

    const imageDoc = new Image({
      title: image.name,
      photoUrl: `${basicPath}/${image.name}`,
      createdDate: new Date(),
    });

    const result = await imageDoc.save();

    await Image.findByIdAndUpdate(result.id, {
      title: image.name,
      photoUrl: `${basicPath}/${result.id}.${extension}`,
      createdDate: new Date(),
    });

    const updatedImage = await Image.findById(result.id);

    if (!updatedImage) {
      return next(new HttpError("Something wrong with the server", 500));
    }

    uploadPath = __dirname + "/public/uploads/" + result.id + "." + extension;
    image.mv(uploadPath, function (err: any) {
      if (err) return res.status(500).send(err);
    });

    res.status(200).json(updatedImage);
  } catch (error) {
    next(error);
  }
};

export const getAllImages: RequestHandler = async (req, res, next) => {
  try {
    const images = await Image.find();

    res.status(200).json({ images: images });
  } catch (error) {
    next(error);
  }
};
