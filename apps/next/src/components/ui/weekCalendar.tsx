import { ResponseScheduleDto } from '@workspace/data'
import { Button } from './button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './card'

export type Props = {
  day: string
  schedule?: ResponseScheduleDto
}

export const DaySchedule = (props: Props) => {
  return (
    <Card className='flex-wrap'>
      <CardHeader>
        <CardTitle>{props.day}</CardTitle>
      </CardHeader>
      <CardContent>
        {props.schedule?.section.map((section, index) => (
          <div key={index}>
            <div>{section.startAt}</div>
            <div>{section.endAt}</div>
            <div>{section.capacity}</div>
            <div>{section.currentCapacity}</div>
          </div>
        ))}
        {props.schedule?.section.length === 0 && <div>No schedule for this day</div>}
      </CardContent>
    </Card>
  )
}
