import { Router } from 'express';

import configurePassport from './passport';
import LoginController from './login.controller';
import RegisterController from './register.controller';

configurePassport();

const routes = Router();

routes.post('/login', LoginController);
routes.post('/register', RegisterController);

export default routes;