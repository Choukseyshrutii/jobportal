<<<<<<< HEAD
import multer from "multer";
const storage=multer.memoryStorage();
=======
import multer from "multer";
const storage=multer.memoryStorage();
>>>>>>> origin/main
export const singleUpload=multer({storage}).single("file");