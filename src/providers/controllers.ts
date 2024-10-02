import UserRepository from "../infrastructure/repositories/UserRepositories";
import UserUseCase from "../use-case/userUseCase";
import UserController from "../adaptors/userController"; 
import SellerController from '../adaptors/sellerController'
import ProductController from "../adaptors/productControroller";
import GenerateOTP from "./generateOTP";
import NodeMailer from "./nodeMailer";
import UserOTPRepository from "../infrastructure/repositories/UserOtpRepositories";
import ProductRepository from "../infrastructure/repositories/ProductListingRepository";
import SellerRepository from "../infrastructure/repositories/SellerRepository";
import SellerUseCase from "../use-case/sellerUsecase";
import Jwt from "./jwt";
import AdminUseCase from "../use-case/adminUseCase";
import AdminController from "../adaptors/adminController";
import AdminRepository from "../infrastructure/repositories/AdminRepository";
import CloudinaryHelper from "./cloudinaryHelper";

// Provider
const jwt = new Jwt()
const OTPGenerator = new GenerateOTP()
const mailer = new NodeMailer()
const cloudinaryHelper = new CloudinaryHelper()


// Repositoriesa
const userRepository = new UserRepository();
const sellerRepository = new SellerRepository()
const userOTPRepo = new UserOTPRepository();
const productRepository = new ProductRepository()
const adminRepository = new AdminRepository()
// UseCases
const userUseCase = new UserUseCase(OTPGenerator, userRepository,mailer,jwt,userOTPRepo,sellerRepository);
const sellerUsecase = new SellerUseCase(sellerRepository,userRepository,jwt,productRepository)
const adminUseCase = new AdminUseCase(jwt,adminRepository,cloudinaryHelper);

// Controller
export const userController = new UserController(userUseCase,jwt);
export const sellerController = new SellerController(sellerUsecase)
export const adminController = new AdminController(adminUseCase);
