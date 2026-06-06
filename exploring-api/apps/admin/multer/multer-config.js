import multer from "multer";

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png"];

  if(allowedTypes.includes(file.mimetype)){
    cb(null, true);
  }
  else{
    cb(new Error("Apenas imagens JPG, PNG ou WEBP são permitidas"), false);
  }
};

const storage = multer.memoryStorage();

export const upload = multer({ 
    storage, 
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});

