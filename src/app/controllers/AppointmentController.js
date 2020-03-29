import Appointment from '../models/Appointments';
import * as Yup from 'yup';
import User from '../models/User';
import File from '../models/File';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import Notification from '../schemas/Notification';
import { ptBR } from 'date-fns/locale';

class AppointmentController {
    async index(req, res) {

        const { page = 1 } = req.query;

        const appointments = await Appointment.findAll({
            where: { user_id: req.userId, canceled_at: null },
            order: ['date'],
            limit: 20,
            offset: (page -1) * 20,
            attributes: ['id', 'date'],
            include: [
                {
                model: User,
                as: 'provider',
                attributes: ['id', 'name'],
                include: [ 
                    {
                    model: File,
                    as: 'avatar',
                    attributes: ['id', 'path', 'url'],
                    },
                ],
            },
        ],
    })

        return res.json(appointments);   
    }

    async store(req, res) {
      const schema = Yup.object().shape({
        provider_id: Yup.number().required(),
        date: Yup.date().required(),
      });
  
      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({
          error: 'Valiation fails',
        });
      }
  
      const { provider_id, date } = req.body;
  
      /**
       * Check if provider is a provider
       */
      const isProvider = await User.findOne({
        where: {
          id: provider_id,
          provider: true,
        },
      });
  
      if (!isProvider) {
        return res
          .status(401)
          .json({ error: 'You can only create appointments with providers' });
      }

      const hourStart = startOfHour(parseISO(date));

      // verifica se a data e valida
      if(isBefore(hourStart, new Date())) {
          return res.status(400).json({ error: 'Past dates are not permitted'});
      }

      const checkAvailability = await Appointment.findOne({
          where: {
              provider_id,
              canceled_at: null,
              date: hourStart,
          }
      });

      if (checkAvailability) {
          return res.status(400).json({ error: 'Appointment date is not available'});
      }

      const appointment = await Appointment.create({
        user_id: req.userId,
        provider_id,
        date,
      });

      // Notify provider
      const user = await User.findByPk(req.userId);
      const formattedDate = format(
        hourStart,
        "'dia' dd 'de' MMMM', às' H:mm'h'",
        {
          locale: ptBR,
        }
      );
      await Notification.create({
        content: `Novo agendamento de ${user.name} para o ${formattedDate}`,
        user: provider_id,
      });

  
      return res.json(appointment);
    }

    async delete(req, res) {

      const appointment = await Appointment.findByPk(req.params.id);

      if(appointment.user_id != req.userId) {
        return res.status(401).json({ error: "You don't have permission to cancel this appointment." });
      }

      const dateWhiteSub = subHours(appointment.date, 2);

      if(isBefore(dateWhiteSub, new Date())) {
        return res.status(401).json({ error: 'You can only cancel appointments 2 hours in advance.'});
      }

      appointment.canceled_at = new Date();

      await appointment.save();

      return res.json(appointment);
    }
  }
  

export default new AppointmentController();