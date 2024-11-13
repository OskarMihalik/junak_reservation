import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { Schedule } from '../schedule/schedule.entity';

@Entity()
export class DaySchedule {
  @PrimaryKey({ autoincrement: true })
  id!: number;

  @ManyToOne(() => Schedule)
  schedule!: Schedule;

  @Property()
  startAt!: Date;

  @Property()
  interval!: number;

  @Property()
  capacity!: number;

  @Property({ onCreate: () => 0 })
  currentCapacity: number = 0;

  @Property({ type: 'text' })
  private _listOfAssignedUsers!: string;

  @Property()
  endAt!: Date;

  get listOfAssignedUsers(): number[] {
    return this._listOfAssignedUsers ? JSON.parse(this._listOfAssignedUsers) as number[] : [];
  }

  set listOfAssignedUsers(value: number[]) {
    this._listOfAssignedUsers = JSON.stringify(value);
  }
}
