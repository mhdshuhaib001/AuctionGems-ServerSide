import { Request, Response } from "express";
import ProductRepository from "../../infrastructure/repositories/ProductListingRepository"; // Import your repository
import userUseCase from "../../use-case/userUseCase";

const productRepository = new ProductRepository();

/**
 * @openapi
 * /api/auth/send-otp:
 *   post:
 *     summary: Send OTP
 *     description: Sends an OTP to the user's email address.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OTP sent successfully
 *       400:
 *         description: Bad request or Email already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email already exists
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

/**
 * @openapi
 * /api/auth/signup:
 *   post:
 *     summary: User Signup
 *     description: Registers a new user after verifying the OTP.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *                 description: The name of the user.
 *               email:
 *                 type: string
 *                 example: user@example.com
 *                 description: The email address of the user.
 *               password:
 *                 type: string
 *                 example: password123
 *                 description: The password for the user account.
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User created successfully
 *       400:
 *         description: OTP not found or bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OTP not found for email
 *       409:
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User already exists
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: User Login
 *     description: Authenticates a user and returns a JWT token upon successful login.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 *                 message:
 *                   type: string
 *                   example: Login successful
 *       400:
 *         description: Bad request or Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid email or password
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

/**
 * @openapi
 * /api/createseller:
 *   post:
 *     summary: Create Seller
 *     description: Registers a new seller profile.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               UserID:
 *                 type: string
 *                 example: 60d0fe4f5311236168a109ca
 *                 description: The user ID associated with the seller.
 *               CompanyName:
 *                 type: string
 *                 example: Awesome Gadgets Inc.
 *                 description: The name of the seller's company.
 *               ContactInfo:
 *                 type: string
 *                 example: contact@awesomegadgets.com
 *                 description: Contact information for the seller.
 *               About:
 *                 type: string
 *                 example: We specialize in innovative tech gadgets.
 *                 description: A brief description about the seller.
 *               IsBlocked:
 *                 type: boolean
 *                 example: false
 *                 description: Indicates whether the seller is blocked.
 *     responses:
 *       201:
 *         description: Seller created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Seller created successfully
 *       400:
 *         description: Bad request or Invalid data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid seller data
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

/**
 * @openapi
 * /api/seller/addproduct:
 *   post:
 *     summary: Create Product
 *     description: Registers a new product in the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               SellerID:
 *                 type: string
 *                 example: "60d0fe4f5311236168a109ca"
 *                 description: The ID of the seller listing the product.
 *               ItemTitle:
 *                 type: string
 *                 example: "Vintage Radio"
 *                 description: The title of the product.
 *               Category:
 *                 type: string
 *                 example: "Electronics"
 *                 description: The category under which the product is listed.
 *               Description:
 *                 type: string
 *                 example: "A classic vintage radio from the 1950s in excellent condition."
 *                 description: A detailed description of the product.
 *               Condition:
 *                 type: string
 *                 enum: [New, Used, Vintage]
 *                 example: "Vintage"
 *                 description: The condition of the product.
 *               Images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "http://example.com/image.jpg"
 *                 description: URLs of the product images.
 *               AuctionFormat:
 *                 type: string
 *                 enum: [Buy-It-Now, Auction]
 *                 example: "Auction"
 *                 description: The format of the auction for the product.
 *               AuctionStartTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-09-01T10:00:00Z"
 *                 description: The start time of the auction.
 *               AuctionEndTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-09-07T10:00:00Z"
 *                 description: The end time of the auction.
 *               ReservePrice:
 *                 type: number
 *                 format: float
 *                 example: 100.00
 *                 description: The minimum price at which the auction will proceed.
 *               ShippingType:
 *                 type: string
 *                 enum: [Standard, Express]
 *                 example: "Standard"
 *                 description: The type of shipping offered for the product.
 *               ShippingCost:
 *                 type: number
 *                 format: float
 *                 example: 15.00
 *                 description: The cost of shipping the product.
 *               HandlingTime:
 *                 type: integer
 *                 example: 3
 *                 description: The number of days required to handle and ship the product.
 *               ItemLocation:
 *                 type: string
 *                 example: "New York, NY"
 *                 description: The location from where the product will be shipped.
 *               ZipCode:
 *                 type: string
 *                 example: "10001"
 *                 description: The zip code of the product's location.
 *               City:
 *                 type: string
 *                 example: "New York"
 *                 description: The city where the product is located.
 *               State:
 *                 type: string
 *                 example: "NY"
 *                 description: The state where the product is located.
 *               ReturnDuration:
 *                 type: integer
 *                 example: 14
 *                 description: The number of days within which returns are accepted.
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product created successfully"
 *                 productData:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60d0fe4f5311236168a109ca"
 *                     SellerID:
 *                       type: string
 *                       example: "60d0fe4f5311236168a109ca"
 *                     ItemTitle:
 *                       type: string
 *                       example: "Vintage Radio"
 *                     Category:
 *                       type: string
 *                       example: "Electronics"
 *                     Description:
 *                       type: string
 *                       example: "A classic vintage radio from the 1950s in excellent condition."
 *                     Condition:
 *                       type: string
 *                       example: "Vintage"
 *                     Images:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: "http://example.com/image.jpg"
 *                     AuctionFormat:
 *                       type: string
 *                       example: "Auction"
 *                     AuctionStartTime:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-09-01T10:00:00Z"
 *                     AuctionEndTime:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-09-07T10:00:00Z"
 *                     ReservePrice:
 *                       type: number
 *                       format: float
 *                       example: 100.00
 *                     ShippingType:
 *                       type: string
 *                       example: "Standard"
 *                     ShippingCost:
 *                       type: number
 *                       format: float
 *                       example: 15.00
 *                     HandlingTime:
 *                       type: integer
 *                       example: 3
 *                     ItemLocation:
 *                       type: string
 *                       example: "New York, NY"
 *                     ZipCode:
 *                       type: string
 *                       example: "10001"
 *                     City:
 *                       type: string
 *                       example: "New York"
 *                     State:
 *                       type: string
 *                       example: "NY"
 *                     ReturnDuration:
 *                       type: integer
 *                       example: 14
 *       400:
 *         description: Bad request or Invalid data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid product data"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
/**
 * @openapi
 * /api/auth/forget-password:
 *   post:
 *     summary: Request Password Reset
 *     description: Sends a password reset link to the user's email address.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *                 description: The email address of the user who wants to reset their password.
 *     responses:
 *       200:
 *         description: Password reset link sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password reset link sent to your email
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User with this email does not exist
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
