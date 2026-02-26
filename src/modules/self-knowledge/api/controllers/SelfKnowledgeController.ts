// src/modules/self-knowledge/infrastructure/http/controllers/SelfKnowledgeController.ts

import { Request, Response } from 'express';
import { SynthesizeStrengthInsight } from '../../application/usecases/SynthesizeStrengthInsight';
import { GenerateAwarenessTrend } from '../../application/usecases/GenerateAwarenessTrend';

export class SelfKnowledgeController {
  constructor(
    private synthesizeStrengthInsight: SynthesizeStrengthInsight,
    private generateAwarenessTrend: GenerateAwarenessTrend // Add this second argument
  ) {}

  /**
   * Process 1: Strength-Based Synthesis
   * POST /api/v1/self-knowledge/synthesize
   */
  async synthesize(req: Request, res: Response) {
    const { userId, detectedPattern, evidenceBlockIds } = req.body;

    const result = await this.synthesizeStrengthInsight.execute({
      userId,
      detectedPattern,
      evidenceBlockIds
    });

    if (result.isFailure) {
      return res.status(400).json({ error: result.error });
    }

    return res.status(200).send();
  }

  /**
   * Process 3: Awareness Growth Tracking
   * POST /api/v1/self-knowledge/awareness-trend
   */
  async generateTrend(req: Request, res: Response) {
    const { userId, snapshots } = req.body;

    const result = await this.generateAwarenessTrend.execute({
      userId,
      snapshots
    });

    if (result.isFailure) {
      return res.status(400).json({ error: result.error });
    }

    return res.status(200).send();
  }
}