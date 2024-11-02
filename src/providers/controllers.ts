import UserRepository from "../infrastructure/repositories/UserRepositories";
import UserUseCase from "../use-case/userUseCase";
import UserController from "../adaptors/controllers/userController"; 
import SellerController from '../adaptors/controllers/sellerController'
import ProductController from "../adaptors/controllers/productControroller";
import GenerateOTP from "./generateOTP";
import NodeMailer from "./nodeMailer";
import UserOTPRepository from "../infrastructure/repositories/UserOtpRepositories";
import ProductRepository from "../infrastructure/repositories/ProductRepository";
import SellerRepository from "../infrastructure/repositories/SellerRepository";
import SellerUseCase from "../use-case/sellerUsecase";
import Jwt from "./jwt";
import ProductUseCase from '../use-case/productUseCase'
import AdminUseCase from "../use-case/adminUseCase";
import AdminController from "../adaptors/controllers/adminController";
import AdminRepository from "../infrastructure/repositories/AdminRepository";
import CloudinaryHelper from "./cloudinaryHelper";
import { OrderRepository } from "../infrastructure/repositories/OrderRepository";
import { OrderUsecase } from "../use-case/orderUseCase";
import OrderController from "../adaptors/controllers/orderController";
import ChatController from "../adaptors/controllers/chatController";
import ChatRepository from "../infrastructure/repositories/ChatRepository";
import ChatUseCase from "../use-case/chatUseCase";
import AuctionUseCase from "../use-case/auctionUseCase";
import AuctionRepository from "../infrastructure/repositories/AuctionRepository";
import AuctionController from "../adaptors/controllers/auctionController";
import { socketIoInit } from "../infrastructure/config/services/socket-io";



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
const orderRepository = new OrderRepository()
const chatRepository = new ChatRepository()
const auctionRepository = new AuctionRepository()

// UseCases
const userUseCase = new UserUseCase(OTPGenerator, userRepository,mailer,jwt,userOTPRepo,sellerRepository,cloudinaryHelper,adminRepository);
const sellerUsecase = new SellerUseCase(sellerRepository,userRepository,jwt,productRepository,adminRepository,cloudinaryHelper)
const adminUseCase = new AdminUseCase(jwt,adminRepository,cloudinaryHelper,sellerRepository);
const productUseCase = new ProductUseCase(productRepository,sellerRepository)
const orderUseCase = new OrderUsecase(orderRepository,sellerRepository,userRepository);
const chatUseCase = new ChatUseCase(chatRepository,sellerRepository)
const auctionUseCase = new AuctionUseCase(auctionRepository,userRepository,mailer,adminRepository)


// Controller
export const userController = new UserController(userUseCase,jwt);
export const sellerController = new SellerController(sellerUsecase)
export const adminController = new AdminController(adminUseCase);
export const productController = new ProductController(productUseCase)
export const orderController = new OrderController(orderUseCase)
export const chatController = new ChatController(chatUseCase)
export const auctionController = new AuctionController(auctionUseCase)