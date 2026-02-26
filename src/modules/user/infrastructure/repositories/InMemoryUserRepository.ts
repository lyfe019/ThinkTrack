// src/modules/user/infrastructure/repositories/InMemoryUserRepository.ts
import { UserRepository } from "../../application/ports/output/UserRepository";
import { User } from "../../domain/entities/User";

export class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];
  
  public async clear(): Promise<void> {
    this.users = [];
  }

  async exists(email: string): Promise<boolean> {
    return this.users.some(u => u.props.email.value === email);
  }

  async save(user: User): Promise<void> {
    const alreadyExists = await this.exists(user.props.email.value);
    if (!alreadyExists) {
      this.users.push(user); // Persistence logic [cite: 207]
    }
  }

  async findAll(): Promise<User[]> {
    return this.users;
  }
}