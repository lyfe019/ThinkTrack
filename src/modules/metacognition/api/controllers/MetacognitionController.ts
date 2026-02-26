import { Request, Response } from 'express';
import { CalibrateUser } from '../../application/usecases/CalibrateUser';
import { SelectStrategy } from '../../application/usecases/SelectStrategy';
import { SubmitReflection } from '../../application/usecases/SubmitReflection';
import { DismissIntervention } from '../../application/usecases/DismissIntervention';

export class MetacognitionController {
  constructor(
    private calibrateUserUseCase: CalibrateUser,
    private selectStrategyUseCase: SelectStrategy,
    private dismissInterventionUseCase: DismissIntervention,
    private submitReflectionUseCase: SubmitReflection
  ) {}

  async calibrate(req: Request, res: Response) {
    const result = await this.calibrateUserUseCase.execute(req.body);
    if (result.isFailure) {
      return res.status(400).json({ error: result.error });
    }
    return res.status(200).json(result.getValue());
  }

  async selectStrategy(req: Request, res: Response) {
    // FIX: Cast to string to satisfy UseCase Request types
    const interventionId = req.params.interventionId as string;
    const { strategyId } = req.body;
    
    const result = await this.selectStrategyUseCase.execute({ 
      interventionId, 
      strategyId 
    });

    if (result.isFailure) {
      return res.status(400).json({ error: result.error });
    }
    return res.status(200).send();
  }

  async dismiss(req: Request, res: Response) {
    // FIX: Cast to string
    const interventionId = req.params.interventionId as string;
    const result = await this.dismissInterventionUseCase.execute({ interventionId });
    
    if (result.isFailure) {
      return res.status(400).json({ error: result.error });
    }
    return res.status(200).send();
  }

  async reflect(req: Request, res: Response) {
    // FIX: Cast to string
    const interventionId = req.params.interventionId as string;
    const result = await this.submitReflectionUseCase.execute({
      interventionId,
      ...req.body
    });

    if (result.isFailure) {
      return res.status(400).json({ error: result.error });
    }
    return res.status(200).send();
  }
}