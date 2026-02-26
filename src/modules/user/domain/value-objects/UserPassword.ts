// src/modules/user/domain/value-objects/UserPassword.ts
import { ValueObject } from "../../../../shared/core/ValueObject";
import { Result } from "../../../../shared/core/Result";
import { Guard } from "../../../../shared/core/Guard";
import bcrypt from "bcrypt";

interface UserPasswordProps {
  value: string;
  hashed?: boolean;
}

export class UserPassword extends ValueObject<UserPasswordProps> {
  get value(): string { return this.props.value; }

  private constructor(props: UserPasswordProps) {
    super(props);
  }

  public static async create(password: string): Promise<Result<UserPassword>> {
    const guardResult = Guard.againstNullOrUndefined(password, 'password');
    if (guardResult.isFailure) return Result.fail<UserPassword>(guardResult.error!);

    if (password.length < 8) {
      return Result.fail<UserPassword>("Password must be at least 8 characters.");
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    return Result.ok<UserPassword>(new UserPassword({ value: hashed, hashed: true }));
  }

  public async comparePassword(plainText: string): Promise<boolean> {
    return bcrypt.compare(plainText, this.props.value);
  }

  // Used when loading from database
  public static createFromHash(hash: string): UserPassword {
    return new UserPassword({ value: hash, hashed: true });
  }
}