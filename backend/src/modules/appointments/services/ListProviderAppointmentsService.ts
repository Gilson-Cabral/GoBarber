import { injectable, inject } from 'tsyringe';

import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { classToClass } from 'class-transformer';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

/**
 * [ { day: 1, available }, { day: 1, available,  } ]
 */

 @injectable()
 class ListProviderAppointmentsService {
   constructor(
     @inject('AppointmentsRepository')
     private appointmentsRepository: IAppointmentsRepository,

     @inject('CacheProvider')
     private cacheProvider: ICacheProvider,
   ) {}

    public async execute({
        provider_id,
        day,
        month,
        year,
      }: IRequest): Promise<Appointment[]> {
        const cachekey = `provider-appointments:${provider_id}:${year}-${month}-${day}`;

        let appointments = await this.cacheProvider.recover<Appointment[]>('asd');

        //console.log(cacheData);

        //let appointments;

        if (!appointments) {
          appointments = await this.appointmentsRepository.findAllInDayFromProvider(
            {
              provider_id,
              day,
              month,
              year,
            },
          );

          //console.log('Buscou do banco');

          await this.cacheProvider.save(cachekey, classToClass(appointments));
        }
    
        return appointments;
      }
    }
    
    export default ListProviderAppointmentsService;