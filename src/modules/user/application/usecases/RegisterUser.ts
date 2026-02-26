// src/modules/user/application/usecases/RegisterUser.ts
import { UseCase } from "../../../../shared/core/UseCase";
import { Result } from "../../../../shared/core/Result";
import { User } from "../../domain/entities/User";
import { UserEmail } from "../../domain/value-objects/UserEmail";
import { UserPassword } from "../../domain/value-objects/UserPassword"; // Added Import
import { UserRepository } from "../ports/output/UserRepository";
import { DomainEvents } from "../../../shared-kernel/domain-events/DomainEvents";
import { UserCreated } from "../../domain/events/UserCreated";

export class RegisterUser implements UseCase<any, any> {
  // Dependency Inversion: We inject the Port, not the Adapter
  constructor(private userRepository: UserRepository) {} 

  async execute(request: any): Promise<Result<User>> {
    // 1. Transform raw input to Domain Value Objects (Email)
    const emailResult = UserEmail.create(request.email);
    if (emailResult.isFailure) return Result.fail<User>(emailResult.error!);

    const email = emailResult.getValue();

    // 2. Cross-Aggregate Invariant: Uniqueness check via the Port
    const userExists = await this.userRepository.exists(email.value);
    if (userExists) return Result.fail<User>("A user with this email already exists.");

    // 3. Transform raw input to Domain Value Objects (Password)
    // The hashing happens inside the Value Object's static create method
    const passwordResult = await UserPassword.create(request.password);
    if (passwordResult.isFailure) return Result.fail<User>(passwordResult.error!);

    // 4. Create the Aggregate Root
    // We pass the validated and hashed UserPassword object instead of a raw string
    const userResult = User.create({
      firstName: request.firstName,
      lastName: request.lastName,
      email: email,
      password: passwordResult.getValue() 
    });

    if (userResult.isFailure) return Result.fail<User>(userResult.error!);
    const user = userResult.getValue();
    
    // 5. Persistence (Transactional Consistency - Listing 19-12)
    await this.userRepository.save(user);

    // 6. Dispatch Domain Event for the Monolith Shared Kernel
    // This allows other modules (like Payment) to react to the new user
    DomainEvents.dispatch(new UserCreated(user));

    return Result.ok<User>(user);
  }
}