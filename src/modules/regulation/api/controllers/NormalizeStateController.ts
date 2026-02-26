import { Request, Response } from 'express';
import { NormalizeState } from '../../application/usecases/NormalizeState';

export class NormalizeStateController {
  constructor(private useCase: NormalizeState) {}

  async execute(req: Request, res: Response): Promise<void> {
    /**
     * FIX: Explicitly cast focusBlockId to string.
     * Express params can technically be string | string[], but our
     * route /session/:focusBlockId/normalize always provides a single string.
     */
    const focusBlockId = req.params.focusBlockId as string;
    const { feeling } = req.body;

    // Optional: Quick validation to ensure 'feeling' exists in the body
    if (!feeling) {
      res.status(400).json({ success: false, error: "Feeling is required for normalization." });
      return;
    }

    try {
      const result = await this.useCase.execute({ 
        focusBlockId, 
        selfReportedFeeling: feeling 
      });

      if (result.isFailure) {
        res.status(400).json({ success: false, error: result.error });
        return;
      }

      res.status(200).json({ success: true, data: result.getValue() });
    } catch (err) {
      console.error(`[NormalizeStateController]: Unexpected error`, err);
      res.status(500).json({ success: false, error: 'An unexpected error occurred' });
    }
  }
}