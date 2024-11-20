import { Cascade, Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Schedule } from "../schedule/schedule.entity.js";

@Entity()
export class DaySchedule {
  @PrimaryKey({ autoincrement: true })
  id!: number;

  @ManyToOne(() => Schedule, { cascade: [Cascade.PERSIST, Cascade.REMOVE] })
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

  constructor(
    schedule: Schedule,
    startAt: Date,
    interval: number,
    capacity: number,
    listOfAssignedUsers: string,
    endAt: Date
  ) {
    this.schedule = schedule;
    this.startAt = startAt;
    this.interval = interval;
    this.capacity = capacity;
    this._listOfAssignedUsers = listOfAssignedUsers;
    this.endAt = endAt;
  }

  get listOfAssignedUsers(): number[] {
    return this._listOfAssignedUsers ? JSON.parse(this._listOfAssignedUsers) as number[] : [];
  }

  set listOfAssignedUsers(value: number[]) {
    this._listOfAssignedUsers = JSON.stringify(value);
  }
}
