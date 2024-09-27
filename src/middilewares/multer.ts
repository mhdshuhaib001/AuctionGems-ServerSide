import multer from 'multer';

// Set up Multer to store files in memory
const storage = multer.memoryStorage();

// Create the upload middleware using the memory storage configuration
const uploadSellerProfile = multer({ storage: storage });

export {
  uploadSellerProfile
};
