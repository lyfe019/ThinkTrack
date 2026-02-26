// src/modules/self-knowledge/infrastructure/http/controllers/PersonalizedProfileController.ts

import { Request, Response } from 'express';
import { UpdatePersonalizedProfile } from '../../application/usecases/UpdatePersonalizedProfile';

export class PersonalizedProfileController {
  constructor(
    private updateProfileUseCase: UpdatePersonalizedProfile
  ) {}

  /**
   * Endpoint: PUT /api/v1/self-knowledge/profile
   * Updates the user's "Golden Rules" based on curated evidence.
   */
  async updateProfile(req: Request, res: Response) {
    const { userId, newOptimalDuration, topStrategies, idealEnergyEntry } = req.body;

    const result = await this.updateProfileUseCase.execute({
      userId,
      newOptimalDuration,
      topStrategies,
      idealEnergyEntry
    });

    if (result.isFailure) {
      return res.status(400).json({ error: result.error });
    }

    return res.status(200).send();
  }
}