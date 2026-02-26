// src/modules/self-knowledge/infrastructure/http/routes/SelfKnowledgeRoutes.ts

import { Router } from 'express';
import { 
  selfKnowledgeController, 
  personalizedProfileController 
} from '../../container'; 

const selfKnowledgeRouter = Router();

/**
 * Process 1: Strength-Based Synthesis
 * POST /api/v1/self-knowledge/synthesize
 * Translates behavioral patterns into non-deficit strength insights.
 */
selfKnowledgeRouter.post('/synthesize', (req, res) => 
  selfKnowledgeController.synthesize(req, res)
);

/**
 * Process 2: Works-for-Me Curation
 * PUT /api/v1/self-knowledge/profile
 * Updates the "Golden Rules" (PersonalizedProfile) based on successful sessions.
 */
selfKnowledgeRouter.put('/profile', (req, res) => 
  personalizedProfileController.updateProfile(req, res)
);

/**
 * Process 3: Awareness Growth Tracking
 * POST /api/v1/self-knowledge/awareness-trend
 * Analyzes the delta between predicted confidence and actual behavioral signals.
 */
selfKnowledgeRouter.post('/awareness-trend', (req, res) => 
  selfKnowledgeController.generateTrend(req, res)
);

export { selfKnowledgeRouter };