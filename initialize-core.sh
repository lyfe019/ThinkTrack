#!/bin/bash

# 1. Create Folder Structure (ThinkTrack Modules)
mkdir -p .github/workflows src/config src/modules/shared-kernel/domain-events src/modules/user/api/controllers src/modules/user/api/routes src/modules/user/application/usecases src/modules/user/application/ports/output src/modules/user/domain/entities src/modules/user/domain/value-objects src/modules/user/infrastructure/repositories src/shared/core src/shared/infrastructure/http/middleware tests/e2e/features/user

# 2. CREATE SHARED CORE CLASSES (The "Bric" DNA)
# Entity.ts
cat <<EOF > src/shared/core/Entity.ts
export abstract class Entity<T> {
  protected readonly _id: string;
  public readonly props: T;

  constructor(props: T, id?: string) {
    this._id = id ? id : Math.random().toString(36).substr(2, 9);
    this.props = props;
  }

  get id(): string { return this._id; }
}
EOF

# Result.ts
cat <<EOF > src/shared/core/Result.ts
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
EOF

# UseCase.ts
cat <<EOF > src/shared/core/UseCase.ts
import { Result } from "./Result";
export interface UseCase<IRequest, IResponse> {
  execute(request?: IRequest): Promise<Result<IResponse>> | Result<IResponse>;
}
EOF

# 3. CREATE SHARED KERNEL (Event Bus)
cat <<EOF > src/modules/shared-kernel/domain-events/DomainEvents.ts
export class DomainEvents {
  private static readonly BUS_KEY = Symbol.for('bric.event_bus');

  private static getHandlersMap(): { [key: string]: any[] } {
    if (!(global as any)[this.BUS_KEY]) { (global as any)[this.BUS_KEY] = {}; }
    return (global as any)[this.BUS_KEY];
  }

  public static register(callback: (event: any) => void, eventClassName: string): void {
    const map = this.getHandlersMap();
    if (!map[eventClassName]) map[eventClassName] = [];
    map[eventClassName].push(callback);
  }

  public static dispatch(event: any): void {
    const eventName = event.constructor.name;
    const map = this.getHandlersMap();
    if (map[eventName]) {
      map[eventName].forEach((handler) => handler(event));
    }
  }
}
EOF

# 4. CREATE USER MODULE (Identity Blueprint)
# Port
cat <<EOF > src/modules/user/application/ports/output/UserRepository.ts
import { User } from "../../../domain/entities/User";
export interface UserRepository {
  exists(email: string): Promise<boolean>;
  save(user: User): Promise<void>;
  findAll(): Promise<User[]>;
}
EOF

# Shared Auth Middleware
cat <<EOF > src/shared/infrastructure/http/middleware/AuthMiddleware.ts
import { Request, Response, NextFunction } from 'express';
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });
  next();
};
EOF

# 5. CI PIPELINE
cat <<EOF > .github/workflows/ci.yml
name: CI Pipeline
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm install
      - run: npm run test:e2e
EOF

chmod +x initialize-core.sh
echo "✅ Core ThinkTrack Infrastructure & Bric Patterns written to files."