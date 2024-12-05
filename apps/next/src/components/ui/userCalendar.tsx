'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { DaySchedule } from '@/components/ui/daySchedule'
import { useToast } from '@/hooks/use-toast'
import { useQueryClientContext } from '@/utils/providers/ReactQueryProvider'
import { getDate, getWeekDays } from '@workspace/common'
import React, { useMemo, useState } from 'react'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

const UserCalendar = () => {
  const client = useQueryClientContext()
  const [pageDate, setPageDate] = useState(new Date())

  const moveOneWeek = (direction: 'NEXT' | 'BACK') => {
    const date = new Date(pageDate)
    date.setHours(1, 0, 0, 0)
    if (direction === 'BACK') {
      date.setDate(date.getDate() - 7)
      setPageDate(date)
      return
    }
    date.setDate(date.getDate() + 7)
    setPageDate(date)
  }

  const { data: weekSchedule, isLoading } = client.schedule.getWeekScheduleByDayAsync.useQuery(
    ['getWeekScheduleByDayAsync', pageDate],
    {
      params: {
        day: pageDate,
      },
    },
  )

  const currentDatesWeek = useMemo(() => {
    const weekDates = getWeekDays(pageDate)
    return weekDates
  }, [pageDate])

  const goNextWeek = () => {
    moveOneWeek('NEXT')
  }

  const goBackWeek = () => {
    moveOneWeek('BACK')
  }
  return (
    <Card className="flex flex-col w-full" style={{ height: '85vh' }}>
      <CardHeader>
        <CardTitle>Calendar</CardTitle>
      </CardHeader>
      <CardContent
        className="flex flex-row flex-wrap md:flex-nowrap h-5/6 overflow-x-auto md:overflow-x-hidden justify-center">
        {currentDatesWeek.map(date => (
          <DaySchedule
            day={getDate(date)}
            key={date.toISOString()}
            schedule={weekSchedule?.body?.find(item => {
              const itemDate = new Date(item.date)
              return dayjs(itemDate).format('YYYY-MM-DD') === dayjs(date).format('YYYY-MM-DD')
            })}
          />
        ))}
      </CardContent>
      <CardFooter>
        <div className="ml-auto">
          <Button onClick={goBackWeek} className="mr-5">
            Go week back
          </Button>
          <Button onClick={goNextWeek}>Next week</Button>
        </div>
      </CardFooter>
    </Card>
  )
}

export default UserCalendar
