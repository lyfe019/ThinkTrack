import { Request, Response } from 'express';
import { AdjustFocusBlock } from '../../application/usecases/AdjustFocusBlock';

export class AdjustFocusBlockController {
  constructor(private useCase: AdjustFocusBlock) {}

  async execute(req: Request, res: Response): Promise<void> {
    try {
      const { minutes } = req.body;
      const { id } = req.params;

      // Type Guard: Ensure id is a single string and minutes is a number
      if (typeof id !== 'string') {
        res.status(400).json({ success: false, error: "Invalid Focus Block ID" });
        return;
      }

      const result = await this.useCase.execute({ 
        focusBlockId: id, 
        minutes: Number(minutes) 
      });

      if (result.isFailure) {
        res.status(400).json({ success: false, error: result.error });
        return;
      }

      res.status(200).json({ success: true, data: result.getValue() });
    } catch (error) {
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }
}