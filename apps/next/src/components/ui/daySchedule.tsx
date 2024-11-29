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
}

const formatTime = (time: string) => {
  return dayjs(time).format('HH:mm')
}

export const DaySchedule = (props: Props) => {
  return (
    <Card className='h-full flex flex-col'>
      <CardHeader>
        <CardTitle>{props.day}</CardTitle>
      </CardHeader>
      <CardContent className='overflow-y-auto'>
        {props.schedule?.section.map((section, index) => (
          <div key={index} className='mb-3'>
            <div className='flex items-center'>
              <div className='text-1xl font-semibold leading-none tracking-tight'>time:</div>
              <div className='ml-2'>{formatTime(section.startAt)}</div>
              <div className='ml-2'>{formatTime(section.endAt)}</div>
            </div>
            <div className='flex items-center mb-3'>
              <div className='text-1xl font-semibold leading-none tracking-tight'>capacity:</div>
              <div className='ml-2'>{section.capacity}/</div>
              <div className='ml-2'>{section.currentCapacity}</div>
            </div>
            <Separator />
          </div>
        ))}
        {(!props.schedule || !props.schedule.section.length) && <div>No schedule for this day</div>}
      </CardContent>
    </Card>
  )
}
