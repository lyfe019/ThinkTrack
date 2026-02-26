import { Entity } from "../../../../shared/core/Entity";
import { UniqueEntityID } from "../../../../shared/core/UniqueEntityID"; // Add this import
import { Result } from "../../../../shared/core/Result";
import { UserEmail } from "../value-objects/UserEmail";
import { UserPassword } from "../value-objects/UserPassword";

interface UserProps { 
  firstName: string; 
  lastName: string; 
  email: UserEmail; 
  password: UserPassword; 
}

export class User extends Entity<UserProps> {
  // Update id type from string to UniqueEntityID
  private constructor(props: UserProps, id?: UniqueEntityID) { 
    super(props, id); 
  }

  // Update id type in the static factory method as well
  public static create(props: UserProps, id?: UniqueEntityID): Result<User> {
    if (!props.firstName || !props.lastName) {
      return Result.fail<User>("User must have both names.");
    }
    return Result.ok<User>(new User(props, id));
  }
}