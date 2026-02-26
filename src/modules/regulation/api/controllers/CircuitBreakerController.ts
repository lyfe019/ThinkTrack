import { Request, Response } from 'express';
import { ActivateCircuitBreaker } from '../../application/usecases/ActivateCircuitBreaker';

export class CircuitBreakerController {
  constructor(private useCase: ActivateCircuitBreaker) {}

  async execute(req: Request, res: Response): Promise<void> {
    const focusBlockId = req.params.focusBlockId as string;

    const result = await this.useCase.execute({ focusBlockId });

    if (result.isFailure) {
      res.status(400).json({ success: false, error: result.error });
      return;
    }

    // result.getValue() now contains { message, newState, focusBlockStatus, menu }
    res.status(200).json({
      success: true,
      data: result.getValue() 
    });
  }
}