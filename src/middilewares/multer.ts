import multer from 'multer';

// Set up Multer to store files in memory
const storage = multer.memoryStorage();

// Create the upload middleware using the memory storage configuration
const upload = multer({ storage: storage });

// Export the upload middleware
export default upload;
