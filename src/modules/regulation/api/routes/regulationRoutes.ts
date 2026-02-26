import { Router } from 'express';
import { authMiddleware } from '../../../../shared/infrastructure/http/middleware/AuthMiddleware';
import { InMemoryRegulationRepository } from '../../infrastructure/repositories/InMemoryRegulationRepository';

// --- Use Case Imports ---
import { EstimateLoad } from '../../application/usecases/EstimateLoad';
import { ActivateCircuitBreaker } from '../../application/usecases/ActivateCircuitBreaker';
import { NormalizeState } from '../../application/usecases/NormalizeState';
import { CheckBurnoutRisk } from '../../application/usecases/CheckBurnoutRisk'; // Added for Process 4

// --- Controller Imports ---
import { GetLoadController } from '../controllers/GetLoadController';
import { CircuitBreakerController } from '../controllers/CircuitBreakerController';
import { NormalizeStateController } from '../controllers/NormalizeStateController';
import { BurnoutWarningController } from '../controllers/BurnoutWarningController'; // Added for Process 4

const regulationRouter = Router();

// Setup Repositories (Singleton)
const regulationRepo = InMemoryRegulationRepository.getInstance();

// Setup Use Cases
const estimateLoadUseCase = new EstimateLoad(regulationRepo);
const activateUseCase = new ActivateCircuitBreaker(regulationRepo);
const normalizeUseCase = new NormalizeState(regulationRepo);
const burnoutUseCase = new CheckBurnoutRisk(regulationRepo); // Added

// Setup Controllers
const getLoadController = new GetLoadController(estimateLoadUseCase);
const circuitBreakerController = new CircuitBreakerController(activateUseCase);
const normalizeController = new NormalizeStateController(normalizeUseCase);
const burnoutController = new BurnoutWarningController(burnoutUseCase); // Added

// --- Route Definitions ---

// GET /api/v1/regulation/session/:focusBlockId/load
regulationRouter.get('/session/:focusBlockId/load', authMiddleware, (req, res) => 
  getLoadController.execute(req, res)
);

// POST /api/v1/regulation/session/:focusBlockId/emergency-exit
regulationRouter.post('/session/:focusBlockId/emergency-exit', authMiddleware, (req, res) => 
  circuitBreakerController.execute(req, res)
);

// POST /api/v1/regulation/session/:focusBlockId/normalize
regulationRouter.post('/session/:focusBlockId/normalize', authMiddleware, (req, res) => 
  normalizeController.execute(req, res)
);

/**
 * GET /api/v1/regulation/session/:focusBlockId/burnout-check
 * NEW: Checks if current load levels and velocity indicate an imminent burnout.
 */
regulationRouter.get('/session/:focusBlockId/burnout-check', authMiddleware, (req, res) => 
  burnoutController.execute(req, res)
);

export { regulationRouter };