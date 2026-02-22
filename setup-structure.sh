#!/bin/bash

# 1. Core Top-Level Folders
mkdir -p .github/workflows docs/decisions docs/diagrams docs/IODD frontend logs public/assets scripts src/config src/contracts/api src/contracts/events src/contracts/messages src/infrastructure/database/migrations src/infrastructure/database/seeds src/infrastructure/logging src/infrastructure/messaging src/infrastructure/utils src/modules/shared-kernel/domain-events src/modules/shared-kernel/entities src/modules/shared-kernel/value-objects src/shared/core src/shared/infrastructure/http/middleware src/shared/infrastructure/http/models src/shared/infrastructure/logging tests/e2e/features tests/fixtures tests/integration tests/stubs tests/ui tests/unit

# 2. ThinkTrack Bounded Contexts (The New Domain)
CONTEXTS=("focus-block" "regulation" "metacognition" "self-knowledge" "identity-preference" "user")

for context in "${CONTEXTS[@]}"
do
    mkdir -p "src/modules/$context/api/controllers"
    mkdir -p "src/modules/$context/api/routes"
    mkdir -p "src/modules/$context/api/middlewares"
    mkdir -p "src/modules/$context/application/usecases"
    mkdir -p "src/modules/$context/application/ports/output"
    mkdir -p "src/modules/$context/domain/entities"
    mkdir -p "src/modules/$context/domain/value-objects"
    mkdir -p "src/modules/$context/domain/events"
    mkdir -p "src/modules/$context/infrastructure/repositories"
    
    # Create Gherkin folders for each context
    mkdir -p "tests/e2e/features/$context"
    
    # Add .gitkeep to ensure empty folders are tracked
    touch "src/modules/$context/api/.gitkeep"
    touch "src/modules/$context/application/.gitkeep"
    touch "src/modules/$context/domain/.gitkeep"
    touch "src/modules/$context/infrastructure/.gitkeep"
done

# 3. Create Key Shared Kernel & Core Files (Empty shells)
touch src/shared/core/Entity.ts
touch src/shared/core/ValueObject.ts
touch src/shared/core/Result.ts
touch src/shared/core/Guard.ts
touch src/shared/core/UseCase.ts
touch src/modules/shared-kernel/domain-events/DomainEvents.ts
touch src/app.ts
touch src/server.ts

# 4. Standard Config Files
touch .env .env.example .gitignore Dockerfile cucumber.js playwright.config.ts tsconfig.json package.json

# 5. Add .gitkeep to deep empty directories
find . -type d -empty -not -path "./.git/*" -exec touch {}/.gitkeep \;

echo "✅ ThinkTrack Bric Monolith structure generated successfully."