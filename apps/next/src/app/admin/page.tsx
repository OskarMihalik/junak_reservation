'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { DaySchedule } from '@/components/ui/weekCalendar'
import { useToast } from '@/hooks/use-toast'
import { useQueryClientContext } from '@/utils/providers/ReactQueryProvider'
import { getDate, getWeekDays } from '@workspace/common'
import React, { useMemo, useState } from 'react'

const adminHomePage = () => {
  const client = useQueryClientContext()
  const { toast } = useToast()
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

  const { data, isLoading } = client.schedule.getWeekScheduleByDayAsync.useQuery(
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

  const [page, setPage] = useState(0)
  const [maxPage, setMaxPage] = useState(0)
  const goNextWeek = () => {
    moveOneWeek('NEXT')
  }

  const goBackWeek = () => {
    moveOneWeek('BACK')
  }
  console.log(data)
  return (
    <Card className='flex-wrap'>
      <CardHeader>
        <CardTitle>Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        {currentDatesWeek.map((date, index) => (
          <DaySchedule day={getDate(date)} key={date.toISOString()} />
        ))}
      </CardContent>
      <CardFooter>
        <div className='ml-auto'>
          <Button onClick={goBackWeek} className='mr-5'>
            Go week back
          </Button>
          <Button onClick={goNextWeek}>Next week</Button>
        </div>
      </CardFooter>
    </Card>
  )
}

export default adminHomePage
