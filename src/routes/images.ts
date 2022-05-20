import { Router } from "express";
import { getAllImages, uploadImage } from "../controllers/images";

const router = Router();

router.post("/upload", uploadImage);

router.get("/getallimages", getAllImages);

export default router;
