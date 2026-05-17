import multer from "multer";
import path from "path";

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png"];

  if(allowedTypes.includes(file.mimetype)){
    cb(null, true);
  }
  else{
    cb(new Error("Apenas imagens JPG, PNG ou WEBP são permitidas"), false);
  }
};

export const createUpload = (destination) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, destination);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); 
    }
  });

  return multer({ storage, fileFilter });
};

