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
}

export default AdminController;
