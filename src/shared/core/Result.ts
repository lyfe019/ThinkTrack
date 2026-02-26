export class Result<T> {
  public isSuccess: boolean;
  public isFailure: boolean;
  public error: string | null;
  private _value: T;

  private constructor(isSuccess: boolean, error?: string | null, value?: T) {
    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.error = error || null;
    this._value = value as T;
  }

  public getValue(): T { return this._value; }
  public static ok<U>(value?: U): Result<U> { return new Result<U>(true, null, value); }
  public static fail<U>(error: string): Result<U> { return new Result<U>(false, error); }
}
