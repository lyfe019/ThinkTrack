import { Request, Response } from 'express';
import { RecordSignal } from '../../application/usecases/RecordSignal';

export class RecordSignalController {
  constructor(private useCase: RecordSignal) {}

  async execute(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { type, metadata } = req.body;

    if (typeof id !== 'string') {
      res.status(400).json({ success: false, error: "Invalid ID format" });
      return;
    }

    const result = await this.useCase.execute({
      focusBlockId: id,
      type,
      metadata
    });

    if (result.isFailure) {
      res.status(400).json({ success: false, error: result.error });
      return;
    }

    res.status(200).json({ 
      success: true, 
      data: result.getValue() 
    });
  }
}