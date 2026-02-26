import { Request, Response } from 'express';
import { RegisterUser } from '../../application/usecases/RegisterUser';

export class RegisterUserController {
  private useCase: RegisterUser;

  constructor(useCase: RegisterUser) {
    this.useCase = useCase;
  }

  async execute(req: Request, res: Response): Promise<void> {
    const dto = req.body;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isFailure) {
        res.status(400).json({ error: result.error });
        return;
      }

      res.status(201).json({ message: "User successfully created" });
    } catch (err) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}