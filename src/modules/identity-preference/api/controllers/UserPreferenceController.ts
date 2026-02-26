import { Request, Response } from 'express';
import { UpdatePreferencesUseCase } from '../../application/usecases/UpdatePreferencesUseCase';

export class UserPreferenceController {
  constructor(private updatePreferences: UpdatePreferencesUseCase) {}

  async update(req: Request, res: Response): Promise<void> {
    const dto = {
      userId: req.params.userId,
      duration: req.body.duration,
      atmosphere: req.body.atmosphere
    };

    const result = await this.updatePreferences.execute(dto);

    if (result.isSuccess) {
      res.status(200).json({ status: 'success' });
    } else {
      // FIX: Accessing the public .error property instead of calling a method
      res.status(400).json({ error: result.error });
    }
  }
}