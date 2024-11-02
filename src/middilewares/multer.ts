import multer from 'multer';

// Set up Multer to store files in memory
const storage = multer.memoryStorage();

// Middleware to handle a single image
const uploadSingleImage = multer({ storage: storage }).single('image');

// Middleware to handle multiple images (up to 5)
const uploadMultipleImages = multer({ storage: storage }).array('images', 5);

const uploadFields = multer({ storage: storage }).fields([
    { name: 'image', maxCount: 1 },
    { name: 'icon', maxCount: 1 }
  ]);
  

export { uploadSingleImage, uploadMultipleImages ,uploadFields};
