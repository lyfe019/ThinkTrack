import { InMemoryUserPreferenceRepository } from "./infrastructure/repositories/InMemoryUserPreferenceRepository";
import { UpdatePreferencesUseCase } from "./application/usecases/UpdatePreferencesUseCase";
import { UserPreferenceController } from "./api/controllers/UserPreferenceController";

// 1. Repositories
const userPreferenceRepo = InMemoryUserPreferenceRepository.getInstance();

// 2. Use Cases
const updatePreferencesUseCase = new UpdatePreferencesUseCase(userPreferenceRepo);

// 3. Controllers
const userPreferenceController = new UserPreferenceController(
  updatePreferencesUseCase
);

export { 
  userPreferenceRepo, 
  updatePreferencesUseCase,
  userPreferenceController 
};