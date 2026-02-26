import { Request, Response } from 'express';
import { InitiateFocusBlock } from '../../application/usecases/InitiateFocusBlock';

export class InitiateFocusBlockController {
  constructor(private useCase: InitiateFocusBlock) {}

  async execute(req: Request, res: Response): Promise<void> {
    try {
      const { energyLevel, minutes, intentDescription } = req.body;
      
      const userId = (req as any).user?.userId || "guest-user";

      const result = await this.useCase.execute({
        energyLevel,
        minutes: Number(minutes),
        intentDescription,
        userId
      });

      if (result.isFailure) {
        const errorMessage = result.error || "An unknown business rule violation occurred.";
        res.status(400).json({
          success: false,
          message: errorMessage, // Current standard
          error: errorMessage    // Backward compatibility for older E2E steps
        });
        return;
      }

      res.status(201).json({
        success: true,
        data: result.getValue()
      });
      
    } catch (err) {
      console.error(`[InitiateFocusBlockController]: ${err}`);
      res.status(500).json({
        success: false,
        message: "Internal server error during session initiation."
      });
    }
  }
}