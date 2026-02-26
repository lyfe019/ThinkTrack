#!/bin/bash

# 1. Ensure Domain & Shared Directories exist
mkdir -p src/shared/core src/shared/infrastructure/http/models src/shared/infrastructure/logging src/modules/user/domain/entities src/modules/user/domain/value-objects src/modules/user/domain/events src/modules/user/infrastructure/repositories tests/e2e/features/user tests/ui

# 2. SHARED CORE IMPLEMENTATION (Guard, ValueObject, Result Update)
cat <<EOF > src/shared/core/Guard.ts
import { Result } from "./Result";
export class Guard {
  public static againstNullOrUndefined(argument: any, argumentName: string): Result<string> {
    if (argument === null || argument === undefined) {
      return Result.fail<string>(\`\${argumentName} is null or undefined\`);
    }
    return Result.ok<string>();
  }
  public static againstAtLeast(numChars: number, text: string): Result<string> {
    return text.length >= numChars ? Result.ok<string>() : Result.fail<string>(\`Text is not at least \${numChars} chars.\`);
  }
}
EOF

cat <<EOF > src/shared/core/ValueObject.ts
interface ValueObjectProps { [index: string]: any; }
export abstract class ValueObject<T extends ValueObjectProps> {
  public readonly props: T;
  constructor(props: T) { this.props = Object.freeze(props); }
  public equals(vo?: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) return false;
    return JSON.stringify(this.props) === JSON.stringify(vo.props);
  }
}
EOF

# 3. USER DOMAIN IMPLEMENTATION
cat <<EOF > src/modules/user/domain/value-objects/UserEmail.ts
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
EOF

cat <<EOF > src/modules/user/domain/entities/User.ts
import { Entity } from "../../../../shared/core/Entity";
import { Result } from "../../../../shared/core/Result";
import { UserEmail } from "../value-objects/UserEmail";
import { UserPassword } from "../value-objects/UserPassword";

interface UserProps { firstName: string; lastName: string; email: UserEmail; password: UserPassword; }
export class User extends Entity<UserProps> {
  private constructor(props: UserProps, id?: string) { super(props, id); }
  public static create(props: UserProps, id?: string): Result<User> {
    if (!props.firstName || !props.lastName) return Result.fail<User>("User must have both names.");
    return Result.ok<User>(new User(props, id));
  }
}
EOF

# 4. INFRASTRUCTURE & APP WIRING
cat <<EOF > src/app.ts
import express from 'express';
import cors from 'cors';
import { userRouter } from './modules/user/api/routes/userRoutes';
import { config } from './config';

const app = express();
app.use(cors());
app.use(express.json());

app.use(\`\${config.api.prefix}/users\`, userRouter);

export { app };
EOF

cat <<EOF > src/server.ts
import { app } from './app';
import { config } from './config';

app.listen(config.port, () => {
  console.log(\`[Bric Monolith]: Running at http://\${config.host}:\${config.port}\`);
});
EOF

chmod +x complete-implementation.sh
echo "✅ ThinkTrack Implementation Complete. Ready for Domain modeling."