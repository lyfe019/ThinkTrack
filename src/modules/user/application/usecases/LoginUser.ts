// src/modules/user/application/usecases/LoginUser.ts
import { UseCase } from "../../../../shared/core/UseCase";
import { Result } from "../../../../shared/core/Result";
import { UserRepository } from "../ports/output/UserRepository";
import { UserPassword } from "../../domain/value-objects/UserPassword";
import jwt from "jsonwebtoken";
import { config } from "../../../../config";

export class LoginUser implements UseCase<any, any> {
  constructor(private userRepository: UserRepository) {}

  public async execute(request: any): Promise<Result<{ token: string }>> {
    // 1. Find user by email
    const users = await this.userRepository.findAll();
    const user = users.find(u => u.props.email.value === request.email.toLowerCase());

    if (!user) {
      return Result.fail("Invalid email or password.");
    }

    // 2. Domain Logic: Use Value Object to compare hashed password
    const passwordMatch = await user.props.password.comparePassword(request.password);

    if (!passwordMatch) {
      return Result.fail("Invalid email or password.");
    }

    // 3. Issue JWT (Infrastructure concern handled here for simplicity in the monolith)
    const token = jwt.sign(
      { userId: user.id, email: user.props.email.value },
      config.api.secret || 'secret_key',
      { expiresIn: '1h' }
    );

    return Result.ok({ token });
  }
}