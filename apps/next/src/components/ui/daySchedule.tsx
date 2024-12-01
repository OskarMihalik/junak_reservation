import { ResponseScheduleDto } from '@workspace/data'
import { Button } from './button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './card'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { Separator } from './separator'

dayjs.extend(customParseFormat)

export type Props = {
  day: string
  schedule?: ResponseScheduleDto
  onTermClick?: (id: number | undefined, day: string, time: string, capacity: string) => void;
}

const formatTime = (time: string) => {
  return dayjs(time).format('HH:mm')
}

export const DaySchedule = ({ day, schedule, onTermClick }: Props) => {
  const handleClick = (section: any) => {
    if (onTermClick) {
      onTermClick(
        section.id,
        day,
        `${formatTime(section.startAt)} - ${formatTime(section.endAt)}`,
        `${section.capacity}/${section.currentCapacity}`,
      )
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{day}</CardTitle>
      </CardHeader>
      <CardContent className="overflow-y-auto">
        {schedule?.section.map((section, index) => (
          <div
            key={index}
            className={`p-2
            ${section.isAssigned ? 'bg-green-500' : (section.capacity === section.currentCapacity ? 'bg-red-500' : 'bg-gray-930')}`} // red if not assigned and is full
            onClick={() => handleClick(section)}
          >
            <div className="mb-3">
              <div className="flex items-center">
                <div className="text-1xl font-semibold leading-none tracking-tight">Time:</div>
                <div className="ml-2">{formatTime(section.startAt)}</div>
                <div className="ml-2">{formatTime(section.endAt)}</div>
              </div>
              <div className="flex items-center mb-3">
                <div className="text-1xl font-semibold leading-none tracking-tight">Capacity:</div>
                <div className="ml-2">{section.capacity}/</div>
                <div className="ml-2">{section.currentCapacity}</div>
              </div>
            </div>
            <Separator />
          </div>
        ))}
        {(!schedule || !schedule.section.length) && <div>No schedule for this day</div>}
      </CardContent>
    </Card>
  )
}

