// src/modules/user/api/routes/userRoutes.ts (Updated)
import { Router } from 'express';
import { RegisterUserController } from '../controllers/RegisterUserController';
import { RegisterUser } from '../../application/usecases/RegisterUser';
import { LoginUserController } from '../controllers/LoginUserController'; // New
import { LoginUser } from '../../application/usecases/LoginUser'; // New
import { InMemoryUserRepository } from '../../infrastructure/repositories/InMemoryUserRepository';
import { authMiddleware } from '../../../../shared/infrastructure/http/middleware/AuthMiddleware';
const userRouter = Router();
export const userRepository = new InMemoryUserRepository();

// Registration Wiring
const registerUserUseCase = new RegisterUser(userRepository);
const registerUserController = new RegisterUserController(registerUserUseCase);

// Login Wiring
const loginUserUseCase = new LoginUser(userRepository);
const loginUserController = new LoginUserController(loginUserUseCase);

userRouter.post('/', (req, res) => registerUserController.execute(req, res));
userRouter.post('/login', (req, res) => loginUserController.execute(req, res)); // The New Route

// PROTECTED: Only logged-in users can list users
userRouter.get('/', authMiddleware, async (req, res) => {
  const users = await userRepository.findAll();
  const response = users.map(user => ({
    id: user.id,
    email: user.props.email.value,
    fullName: `${user.props.firstName} ${user.props.lastName}`
  }));
  res.status(200).json(response);
});


export { userRouter };