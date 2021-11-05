import { injectable, inject } from 'tsyringe';
import { getDaysInMonth, getDate, isAfter } from 'date-fns';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface Request {
    provider_id: string;
    month: number;
    year: number;
}

/**
 * [ { day: 1, available }, { day: 1, available,  } ]
 */

type IResponse = Array<{
    day: number;
    available: boolean;
}>

@injectable()
class ListProvidersMonthAvailabilityService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmetsRepository: IAppointmentsRepository,
    ) {}

    public async execute({ provider_id, year, month }: Request): Promise<IResponse> {
      const appointments = await this.appointmetsRepository.findAllInMonthFromProvider({
          provider_id,
          year,
          month, 
        },
      ); 
      
      //console.log(appointments);

      const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));

      const eachDayArray = Array.from(
          { length: numberOfDaysInMonth },
          (_, index) => index + 1,
      );

      //console.log(eachDayArray);

      const availability = eachDayArray.map(day => {
        const compareDate = new Date(year, month - 1, day, 23, 59, 59);

        const appointmentsInDay = appointments.filter(appointment => {
            return getDate(appointment.date) == day;
        });

        return {
            day,
            available: isAfter(compareDate, new Date()) && appointmentsInDay.length < 10, 
        };
      });

      return availability;
    }
}

export default ListProvidersMonthAvailabilityService;