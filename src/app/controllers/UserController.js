import User from '../models/User';

class UserController {
  async store(request, response) {
    const userExist = await User.findOne({ where: { email: request.body.email } });

    if (userExist) {
      return response.status(400).json({ error: 'User already exists ' });
    }
    const {
      id, name, email, provider,
    } = await User.create(request.body);

    return response.json({
      id, name, email, provider,
    });
  }
}

export default new UserController();
