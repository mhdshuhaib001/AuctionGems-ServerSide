const multer = require('multer')
const {CloudinaryStorage} = require('multer-storage-cloudinary');
const  cloudinary = '../config/cloudinaryConfig'; // Adjust the path if necessary


// Multer Storage for Seller Profile
const sellerProfileStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'seller_profiles',
      allowed_formats: ['jpg', 'png'],
      public_id: (req:any, file:any) => `seller_${Date.now()}_${file.originalname}`,
    },
  });
  
  // Multer Storage for User Profile
  const userProfileStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'user_profiles',
      allowed_formats: ['jpg', 'png'],
      public_id: (req:any, file:any) => `user_${Date.now()}_${file.originalname}`,
    },
  });
  
  // Multer Storage for Product
  const productStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'product_images',
      allowed_formats: ['jpg', 'png'],
      public_id: (req:any, file:any) => `product_${Date.now()}_${file.originalname}`,
    },
  });


  const uplodeSellerProfile = multer({storage:sellerProfileStorage});

export {
    uplodeSellerProfile
  }