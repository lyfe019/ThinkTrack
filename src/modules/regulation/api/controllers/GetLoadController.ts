import { Request, Response } from 'express';
import { EstimateLoad } from '../../application/usecases/EstimateLoad';

export class GetLoadController {
  constructor(private estimateLoadUseCase: EstimateLoad) {}

  async execute(req: Request, res: Response): Promise<void> {
    const focusBlockId = req.params.focusBlockId as string;
    const signalFrequency = Number(req.query.frequency) || 0;

    const result = await this.estimateLoadUseCase.execute({
      focusBlockId,
      signalFrequency
    });

    if (result.isFailure) {
      res.status(400).json({ success: false, error: result.error });
      return;
    }

    // result.getValue() now contains { load, velocity, stateLabel }
    res.status(200).json({
      success: true,
      data: result.getValue()
    });
  }
}