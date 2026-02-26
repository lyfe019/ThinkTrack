import { ValueObject } from "../../../../shared/core/ValueObject";
import { Result } from "../../../../shared/core/Result";
import { Guard } from "../../../../shared/core/Guard";

export class UserEmail extends ValueObject<{ value: string }> {
  get value(): string { return this.props.value; }
  private constructor(props: { value: string }) { super(props); }
  public static create(email: string): Result<UserEmail> {
    const guardResult = Guard.againstNullOrUndefined(email, 'email');
    if (guardResult.isFailure) return Result.fail<UserEmail>(guardResult.error!);
    if (!/^\S+@\S+\.\S+$/.test(email)) return Result.fail<UserEmail>("Invalid email format.");
    return Result.ok<UserEmail>(new UserEmail({ value: email.toLowerCase() }));
  }
}
