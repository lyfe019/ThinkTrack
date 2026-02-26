import express from 'express';
import cors from 'cors';
import { config } from './config';

// Route Imports
import { focusBlockRouter } from './modules/focus-block/api/routes/focusBlockRoutes'; 
import { regulationRouter } from './modules/regulation/api/routes/regulationRoutes';
import { metacognitionRouter } from './modules/metacognition/api/routes/metacognitionRoutes';
// NEW: Identity & Preference Router
import { preferenceRouter } from './modules/identity-preference/api/routes/preferenceRoutes';

// Subscriber Imports
import { AfterEmergencyExit } from './modules/focus-block/application/subscribers/AfterEmergencyExit';
import { AfterStrategySelected } from './modules/metacognition/application/subscribers/AfterStrategySelected';

// Repository / Use Case Instances for Subscribers
import { InMemoryFocusBlockRepository } from './modules/focus-block/infrastructure/repositories/InMemoryFocusBlockRepository';
import { recordEfficacy } from './modules/metacognition/api/container';

const app = express();

app.use(cors());
app.use(express.json());

// --- ROUTES ---
app.use(`${config.api.prefix}/focus-blocks`, focusBlockRouter); 
app.use(`${config.api.prefix}/regulation`, regulationRouter);
app.use(`${config.api.prefix}/metacognition`, metacognitionRouter);
// NEW: Mount the Preference Routes
app.use(`${config.api.prefix}/preferences`, preferenceRouter);

// --- INITIALIZE SUBSCRIBERS ---
// This ensures that as soon as the app starts, the listeners are ready.

// 1. Focus Block Subscribers
const focusBlockRepo = InMemoryFocusBlockRepository.getInstance();
new AfterEmergencyExit(focusBlockRepo); 

// 2. Metacognition Subscribers (Process 3: Effectiveness Window)
new AfterStrategySelected(recordEfficacy);

// Note: If you add any Identity-specific subscribers (like "AfterIdentityChanged"),
// you would initialize them here.

console.log("[ThinkTrack]: All Subscribers initialized.");

export { app };