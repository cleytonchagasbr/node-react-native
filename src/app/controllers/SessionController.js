import jwt from 'jsonwebtoken';
import User from '../models/User';
import auth from '../../config/auth';
import * as Yup from 'yup';

class SessionController {
    async store(request, response) {
        const schema = Yup.object().shape({
            email: Yup.string().email().required(),
            password: Yup.string().required()
          });

        if( (!await schema.isValid(request.body))) {
            return response.status(400).json({ error: 'Validation fails'});
        }  

        const { email, password } = request.body;

        const user = await User.findOne({ where: { email }});

        if(!user) {
            return response.status(401).json({ error: 'User not found' });
        }

        if(!(await user.checkPassword(password))) {
            return response.status(401).json({ error: 'Passoword does not match' });
        }

        const { id, name } = user;

        return response.json(
            { user: { id, name, email,
            },
            token: jwt.sign({ id }, auth.secret, {
                expiresIn: auth.expiresIn,
            }),
        })
    }
}

export default new SessionController();