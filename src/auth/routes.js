import { Router } from 'express';
import LoginController from './login.controller';
import RegisterController from './register.controller';

const routes = Router();

routes.post('/login', LoginController);
routes.post('/register', RegisterController);

export default routes;