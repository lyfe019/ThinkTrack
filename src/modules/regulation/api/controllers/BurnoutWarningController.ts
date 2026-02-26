import { Request, Response } from 'express';
import { CheckBurnoutRisk } from '../../application/usecases/CheckBurnoutRisk';

export class BurnoutWarningController {
  constructor(private useCase: CheckBurnoutRisk) {}

  async execute(req: Request, res: Response): Promise<void> {
    // FIX: Cast to string for type safety
    const focusBlockId = req.params.focusBlockId as string;

    const result = await this.useCase.execute({ focusBlockId });

    if (result.isFailure) {
      res.status(400).json({ success: false, error: result.error });
      return;
    }

    res.status(200).json({ success: true, data: result.getValue() });
  }
}