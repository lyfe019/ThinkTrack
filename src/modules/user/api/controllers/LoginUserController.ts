// src/modules/user/api/controllers/LoginUserController.ts
import { Request, Response } from 'express';
import { LoginUser } from '../../application/usecases/LoginUser';

export class LoginUserController {
  constructor(private useCase: LoginUser) {}

  async execute(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.useCase.execute(req.body);

      if (result.isFailure) {
        res.status(401).json({ error: result.error });
        return;
      }

      const data = result.getValue();
      res.status(200).json({ 
        message: "Login successful", 
        token: data.token 
      });
    } catch (err) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}