import { zResponseScheduleDto } from '@workspace/data';
import { Schedule } from "./schedule.entity.js";
import { DaySchedule } from "../daySchedule/daySchedule.entity.js";


export const mapScheduleToResponseDto = (schedule: Schedule, userId?: number) => {
  return zResponseScheduleDto.parse({
    id: schedule.id,
    day: schedule.day,
    date: schedule.date,
    section: schedule.daySchedules.getItems().map((daySchedule: DaySchedule) => ({
      id: daySchedule.id,
      startAt: daySchedule.startAt.toISOString(),
      interval: daySchedule.interval,
      capacity: daySchedule.capacity,
      currentCapacity: daySchedule.currentCapacity,
      isAssigned: userId !== undefined ? daySchedule.listOfAssignedUsers.includes(userId) : false,
      endAt: daySchedule.endAt.toISOString(),
    })),
  });
};
