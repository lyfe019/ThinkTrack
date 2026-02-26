import { Router } from 'express';
// Note: In a real setup, you'd pull these from a Dependency Injection container
import { metacognitionController } from '../container'; 

const metacognitionRouter = Router();

// Process 1: Start Calibration & get strategies
metacognitionRouter.post('/calibrate', (req, res) => metacognitionController.calibrate(req, res));

// Process 2: Select a strategy for an active intervention
metacognitionRouter.post('/interventions/:interventionId/select', (req, res) => metacognitionController.selectStrategy(req, res));

// Process 2: Dismiss an intervention
metacognitionRouter.post('/interventions/:interventionId/dismiss', (req, res) => metacognitionController.dismiss(req, res));

// Process 4: Submit post-session reflection
metacognitionRouter.post('/interventions/:interventionId/reflect', (req, res) => metacognitionController.reflect(req, res));

export { metacognitionRouter };