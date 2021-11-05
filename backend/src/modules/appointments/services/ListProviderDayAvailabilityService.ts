import { injectable, inject } from 'tsyringe';
import { getHours, isAfter } from 'date-fns';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface Request {
    provider_id: string;
    day: number;
    month: number;
    year: number;
}

/**
 * [ { day: 1, available }, { day: 1, available,  } ]
 */

type IResponse = Array<{
    hour: number;
    available: boolean;
}>

@injectable()
class ListProvidersDayAvailabilityService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmetsRepository: IAppointmentsRepository,
    ) {}

    public async execute({ provider_id, year, month, day }: Request): Promise<IResponse> {
      const appointments = await this.appointmetsRepository.findAllInDayFromProvider({
         provider_id,
         year,
         month,
         day,
      }); 

      const hourStart = 8;

      const eachHourArray = Array.from(
          { length: 10 },
          (_, index) => index + hourStart,
      );

      const currentDate = new Date(Date.now());

      const availability = eachHourArray.map(hour => {
        const hasAppointmentInHour = appointments.find(appointment => 
           getHours(appointment.date) == hour, 
        );
        
        const compareDate = new Date(year, month - 1, day, hour);

        // 2020-05-20 08:00:00

        return {
            hour,
            available: !hasAppointmentInHour && isAfter(compareDate, currentDate),
        }
      });

      return availability;
    }
}

export default ListProvidersDayAvailabilityService;