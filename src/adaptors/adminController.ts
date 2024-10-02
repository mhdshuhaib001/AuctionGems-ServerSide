import AdminUseCase from "../use-case/adminUseCase";
import { Request, Response } from "express";

class AdminController {
    constructor(private readonly _AdminUsecase: AdminUseCase) {}

    async adminLogin(req: Request, res: Response) {
        try {
            const AdminData = req.body;
            const result = await this._AdminUsecase.adminLogin(AdminData);
            res.status(result.status || 200).json(result);
        } catch (error) {
            console.error('Error during sign in:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    async fetchUsers(req: Request, res: Response) {
        try {
            const users = await this._AdminUsecase.fetchAllUsers();
            res.status(200).json( users );
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async updateUserActiveStatus(req:Request,res:Response){
        try {
            const {userId } = req.body
            const result = await this._AdminUsecase.updateUserActiveStatus(userId )
            res.status(200).json( result );

        } catch (error) {
            console.error('Error actionhandle admin:', error);
            res.status(500).json({ error: 'Internal server error' });
            
        }
    }


    async addCategory(req: Request, res: Response) {
        try {
            const { name } = req.body;
    
            const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    
            if (!files) {
                return res.status(400).json({ error: 'Files are required' });
            }
    
            const imageFile = files['image'] ? files['image'][0] : null;
            const iconFile = files['icon'] ? files['icon'][0] : null;
    
            let imageUrl: string | null = null;
            let iconUrl: string | null = null;
    

         console.log(imageFile,'imageFile');
         console.log(iconFile,'icon file ');
            // Build the category data object
            const categoryData = {
                name: req.body.name,
                image: imageUrl || '', 
                icon: iconUrl || '', 
            };
            
            const response = await this._AdminUsecase.addCategory(categoryData,imageFile,iconFile);
    
            res.status(201).json({ message: 'Category added successfully', data: response });
        } catch (error) {
            console.error('Error in addCategory controller:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    async getAllCategory(req:Request,res:Response){
        try {
            const categories =await this._AdminUsecase.getAllCategory()
            res.status(200).json({categories})
        } catch (error) {
            console.error('Error in getAllCategory controller:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    
    async updateCategory(req:Request,res:Response){
        try {
           
            const categoryId = req.params.id
            const updateData = {...req.body};
            const files = req.files

            const updatedCategory = await this._AdminUsecase.updateCategory(categoryId, updateData, files);
console.log(updatedCategory,'the constrolle ')
        } catch (error) {
            console.error('Error in controller:', error);
    res.status(500).json({ message: 'Failed to update category', error });
        }
    }
}

export default AdminController;
