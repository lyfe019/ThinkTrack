import { Request, Response } from 'express';
import { TriggerSoftLanding } from '../../application/usecases/TriggerSoftLanding';

export class TriggerSoftLandingController {
  constructor(private useCase: TriggerSoftLanding) {}

  async execute(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    if (typeof id !== 'string') {
      res.status(400).json({ success: false, error: "Invalid ID format" });
      return;
    }

    const result = await this.useCase.execute({ focusBlockId: id });

    if (result.isFailure) {
      res.status(400).json({ success: false, error: result.error });
      return;
    }

    res.status(200).json({ success: true, data: result.getValue() });
  }
}