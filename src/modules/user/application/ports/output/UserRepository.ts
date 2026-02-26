import { User } from "../../../domain/entities/User";
export interface UserRepository {
  exists(email: string): Promise<boolean>;
  save(user: User): Promise<void>;
  findAll(): Promise<User[]>;
}
