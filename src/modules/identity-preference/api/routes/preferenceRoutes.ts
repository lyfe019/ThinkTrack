import { Router } from 'express';
import { userPreferenceController } from '../../container'; 

const preferenceRouter = Router();

/**
 * Process 3 & 4: Preference Evolution & Orchestration
 * PATCH /api/v1/preferences/:userId
 */
preferenceRouter.patch('/:userId', (req, res) => 
  userPreferenceController.update(req, res)
);

export { preferenceRouter };