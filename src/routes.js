import { Router } from 'express';
import User from './app/models/User';

const routes = new Router();

routes.get('/', async (request, response) => {
  const user = await User.create({
    name: 'Novo teste',
    email: 'cleyton.need2@gmail.com',
    password_hash: '321654',
  });

  return response.json(user);
});


export default routes;
