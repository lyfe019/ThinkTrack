import { Result } from "./Result";
export class Guard {
  public static againstNullOrUndefined(argument: any, argumentName: string): Result<string> {
    if (argument === null || argument === undefined) {
      return Result.fail<string>(`${argumentName} is null or undefined`);
    }
    return Result.ok<string>();
  }
  public static againstAtLeast(numChars: number, text: string): Result<string> {
    return text.length >= numChars ? Result.ok<string>() : Result.fail<string>(`Text is not at least ${numChars} chars.`);
  }
}
