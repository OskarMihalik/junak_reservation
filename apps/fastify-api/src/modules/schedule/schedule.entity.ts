import { Entity, PrimaryKey, Property, Enum, OneToMany, Collection } from '@mikro-orm/core'
import { DaySchedule } from '../daySchedule/daySchedule.entity.js'

export enum DayEnum {
  MON = 'MON',
  TUE = 'TUE',
  WED = 'WED',
  THU = 'THU',
  FRI = 'FRI',
  SAT = 'SAT',
  SUN = 'SUN',
}

@Entity()
export class Schedule {
  @PrimaryKey({ autoincrement: true })
  id!: number;

  @Enum(() => DayEnum)
  day!: DayEnum;

  @Property({ onCreate: () => new Date() })
  start: Date = new Date();

  @OneToMany(() => DaySchedule, daySchedule => daySchedule.schedule)
  daySchedules = new Collection<DaySchedule>(this);
}
