import { Entity, PrimaryKey, Property, Enum, OneToMany, Collection, Cascade } from "@mikro-orm/core";
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

  @Property({ type: 'date' })
  date: string;

  @OneToMany(() => DaySchedule, daySchedule => daySchedule.schedule, { cascade: [Cascade.PERSIST, Cascade.REMOVE], orphanRemoval: true })
  daySchedules = new Collection<DaySchedule>(this);

  constructor(day: DayEnum, date: Date) {
    this.day = day;
    this.date = date.toISOString().split('T')[0];
    console.log(this.date);
  }
}
