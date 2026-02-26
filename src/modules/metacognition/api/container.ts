import { MetacognitionController } from "./controllers/MetacognitionController";
import { CalibrateUser } from "../application/usecases/CalibrateUser";
import { SelectStrategy } from "../application/usecases/SelectStrategy";
import { DismissIntervention } from "../application/usecases/DismissIntervention";
import { SubmitReflection } from "../application/usecases/SubmitReflection";
import { RecordEfficacy } from "../application/usecases/RecordEfficacy";

import { InMemoryStrategyRepository } from "../infrastructure/repositories/InMemoryStrategyRepository";
import { InMemoryInterventionRepository } from "../infrastructure/repositories/InMemoryInterventionRepository";
import { seedStrategies } from "../infrastructure/repositories/StrategySeed";

// 1. Repositories
const strategyRepo = new InMemoryStrategyRepository();
const interventionRepo = InMemoryInterventionRepository.getInstance();

// Seed data
seedStrategies.forEach(strategy => strategyRepo.save(strategy));

// 2. Use Cases - Injecting the Singleton interventionRepo
const calibrateUserUseCase = new CalibrateUser(strategyRepo, interventionRepo);
const selectStrategyUseCase = new SelectStrategy(interventionRepo);
const dismissInterventionUseCase = new DismissIntervention(interventionRepo);
const submitReflectionUseCase = new SubmitReflection(interventionRepo);
const recordEfficacy = new RecordEfficacy(interventionRepo);

// 3. Controller
const metacognitionController = new MetacognitionController(
  calibrateUserUseCase,
  selectStrategyUseCase,
  dismissInterventionUseCase,
  submitReflectionUseCase
);

export { metacognitionController, recordEfficacy, interventionRepo };