import { Router } from 'express';

// Middleware
import { authMiddleware } from '../../../../shared/infrastructure/http/middleware/AuthMiddleware';

// Infrastructure
import { InMemoryFocusBlockRepository } from '../../infrastructure/repositories/InMemoryFocusBlockRepository';

// Use Cases
import { InitiateFocusBlock } from '../../application/usecases/InitiateFocusBlock';
import { AdjustFocusBlock } from '../../application/usecases/AdjustFocusBlock';
import { TriggerSoftLanding } from '../../application/usecases/TriggerSoftLanding';
import { CompleteFocusBlock } from '../../application/usecases/CompleteFocusBlock';
import { RecordSignal } from '../../application/usecases/RecordSignal';
import { GetFocusBlock } from '../../application/usecases/GetFocusBlock';

// Controllers
import { InitiateFocusBlockController } from '../controllers/InitiateFocusBlockController';
import { AdjustFocusBlockController } from '../controllers/AdjustFocusBlockController';
import { TriggerSoftLandingController } from '../controllers/TriggerSoftLandingController';
import { CompleteFocusBlockController } from '../controllers/CompleteFocusBlockController';
import { RecordSignalController } from '../controllers/RecordSignalController';
import { GetFocusBlockController } from '../controllers/GetFocusBlockController';

const focusBlockRouter = Router();

// --- Dependency Injection Setup ---
// Singleton repository used across all controllers in this module
const focusBlockRepo = InMemoryFocusBlockRepository.getInstance();

// 1. Initiate (The "Protector" gateway)
const initiateUseCase = new InitiateFocusBlock(focusBlockRepo);
const initiateController = new InitiateFocusBlockController(initiateUseCase);

// 2. Adjust
const adjustUseCase = new AdjustFocusBlock(focusBlockRepo);
const adjustController = new AdjustFocusBlockController(adjustUseCase);

// 3. Soft Landing
const triggerUseCase = new TriggerSoftLanding(focusBlockRepo);
const triggerController = new TriggerSoftLandingController(triggerUseCase);

// 4. Completion
const completeUseCase = new CompleteFocusBlock(focusBlockRepo);
const completeController = new CompleteFocusBlockController(completeUseCase);

// 5. Signal Capture
const recordSignalUseCase = new RecordSignal(focusBlockRepo);
const recordSignalController = new RecordSignalController(recordSignalUseCase);

// 6. Get Block (Query)
const getBlockUseCase = new GetFocusBlock(focusBlockRepo);
const getBlockController = new GetFocusBlockController(getBlockUseCase);


// --- Route Definitions ---

// POST /api/v1/focus-blocks -> Start new session
focusBlockRouter.post('/', authMiddleware, (req, res) => 
  initiateController.execute(req, res)
);

// GET /api/v1/focus-blocks/:id -> Retrieve session data
focusBlockRouter.get('/:id', authMiddleware, (req, res) => 
  getBlockController.execute(req, res)
);

// PATCH /api/v1/focus-blocks/:id/adjustment -> Time Swell/Shrink
focusBlockRouter.patch('/:id/adjustment', authMiddleware, (req, res) => 
  adjustController.execute(req, res)
);

// POST /api/v1/focus-blocks/:id/soft-landing -> Start cool-down phase
focusBlockRouter.post('/:id/soft-landing', authMiddleware, (req, res) => 
  triggerController.execute(req, res)
);

// POST /api/v1/focus-blocks/:id/complete -> Record mood and finish
focusBlockRouter.post('/:id/complete', authMiddleware, (req, res) => 
  completeController.execute(req, res)
);

// POST /api/v1/focus-blocks/:id/signals -> Ingest cognitive signals
focusBlockRouter.post('/:id/signals', authMiddleware, (req, res) => 
  recordSignalController.execute(req, res)
);

export { focusBlockRouter };