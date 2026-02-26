// src/modules/self-knowledge/container.ts

import { InMemoryLearningProfileRepository } from "./infrastructure/repositories/InMemoryLearningProfileRepository";
import { SynthesizeStrengthInsight } from "./application/usecases/SynthesizeStrengthInsight";
import { UpdatePersonalizedProfile } from "./application/usecases/UpdatePersonalizedProfile";
import { GenerateAwarenessTrend } from "./application/usecases/GenerateAwarenessTrend";
import { SelfKnowledgeController } from "./api/controllers/SelfKnowledgeController";
import { PersonalizedProfileController } from "./api/controllers/PersonalizedProfileController";

// 1. Repositories
const learningProfileRepo = InMemoryLearningProfileRepository.getInstance();

// 2. Use Cases
const synthesizeStrengthInsight = new SynthesizeStrengthInsight(learningProfileRepo);
const updatePersonalizedProfile = new UpdatePersonalizedProfile(learningProfileRepo);
const generateAwarenessTrend = new GenerateAwarenessTrend(learningProfileRepo);

// 3. Controllers
// SelfKnowledgeController now coordinates Synthesis and Awareness Growth
const selfKnowledgeController = new SelfKnowledgeController(
  synthesizeStrengthInsight,
  generateAwarenessTrend
);

const personalizedProfileController = new PersonalizedProfileController(
  updatePersonalizedProfile
);

export { 
  learningProfileRepo, 
  synthesizeStrengthInsight, 
  updatePersonalizedProfile,
  generateAwarenessTrend,
  selfKnowledgeController,
  personalizedProfileController 
};