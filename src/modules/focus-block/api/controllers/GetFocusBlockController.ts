import { Request, Response } from 'express';
import { GetFocusBlock } from '../../application/usecases/GetFocusBlock';

export class GetFocusBlockController {
  constructor(private useCase: GetFocusBlock) {}

  async execute(req: Request, res: Response): Promise<void> {
    // Explicitly destructure and cast to string to satisfy TypeScript
    const id = req.params.id as string;

    try {
      const result = await this.useCase.execute(id);

      if (result.isFailure) {
        res.status(404).json({ error: result.error });
        return;
      }

      res.status(200).json({
        data: result.getValue()
      });
    } catch (err) {
      console.error(`[GetFocusBlockController]: Error fetching block ${id}`, err);
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
}