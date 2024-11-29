import { DaySchedule } from "./daySchedule.entity.js";
import { zResponseIntervalDto } from "@workspace/data";
import { z } from "zod";

export const mapDayScheduleToIntervalDto = (daySchedule: DaySchedule): z.infer<typeof zResponseIntervalDto> => {
  return {
    id: daySchedule.id,
    startAt: daySchedule.startAt.toISOString(),
    interval: daySchedule.interval,
    capacity: daySchedule.capacity,
    currentCapacity: daySchedule.currentCapacity,
    listOfAssignedUsers: daySchedule.listOfAssignedUsers,
    endAt: daySchedule.endAt.toISOString(),
  };
};
