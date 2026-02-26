import { Request, Response } from 'express';
import { CompleteFocusBlock } from '../../application/usecases/CompleteFocusBlock';

export class CompleteFocusBlockController {
  constructor(private useCase: CompleteFocusBlock) {}

  async execute(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { mood, outcome } = req.body;

    // Fix for ts(2322): Narrow the type to strictly string
    if (typeof id !== 'string') {
      res.status(400).json({ success: false, error: "Invalid ID format" });
      return;
    }

    const result = await this.useCase.execute({
      focusBlockId: id,
      mood,
      outcome
    });

    if (result.isFailure) {
      res.status(400).json({ success: false, error: result.error });
      return;
    }

    res.status(200).json({ success: true, data: result.getValue() });
  }
}