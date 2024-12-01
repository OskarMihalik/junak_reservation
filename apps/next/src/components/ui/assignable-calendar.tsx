'use client'

import React, { useMemo, useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DaySchedule } from '@/components/ui/daySchedule'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { useQueryClientContext } from '@/utils/providers/ReactQueryProvider'
import { getDate, getWeekDays } from '@workspace/common'
import dayjs from 'dayjs'

const AssignableCalendar = () => {
  const client = useQueryClientContext()
  const [pageDate, setPageDate] = useState(new Date())
  const [showModal, setShowModal] = useState(false)
  const [selectedTerm, setSelectedTerm] = useState<{ day: string; time: string; capacity: string; id: number | undefined } | null>(null);


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

  const { toast } = useToast()

  const { data: weekSchedule , refetch} = client.schedule.getWeekScheduleByDayAsync.useQuery(
    ['getWeekScheduleByDayAsync', pageDate],
    {
      params: {
        day: pageDate,
      },
    }
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

  const { mutate: assingSchedule } = client.schedule.assignScheduleAsync.useMutation({
    onSuccess: (response) => {
      toast({ description: response.body })
      refetch()
    },
    onError: (error) => {
      toast({
        description: error.body?.message || 'Failed to assign schedule.',
      })
    },
  })

  //open modal confirmation and save term data
  const handleTermClick = (id: number | undefined, day: string, time: string, capacity: string) => {
    if (id === undefined) {
      console.error('Schedule ID is undefined')
      return
    }
    console.log(`Clicked term on ${day} at ${time} with capacity: ${capacity} and id: ${id}`)
    setSelectedTerm({ day, time, capacity, id })
    setShowModal(true)
  }

  return (
    <>
      <Card className="flex flex-col w-full" style={{ height: '85vh' }}>
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-row h-5/6 overflow-x-auto justify-center">
          {currentDatesWeek.map((date) => {
            const schedule = weekSchedule?.body?.find((item) => {
              const itemDate = new Date(item.date)
              return dayjs(itemDate).format('YYYY-MM-DD') === dayjs(date).format('YYYY-MM-DD')
            })

            return (
              <div key={date.toISOString()}>
                <DaySchedule
                  day={getDate(date)}
                  schedule={schedule}
                  onTermClick={handleTermClick} // Pass handleTermClick to DaySchedule
                />
              </div>
            );
          })}
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

      <Dialog open={showModal} onOpenChange={(open) => setShowModal(open)}>
        <DialogContent aria-describedby="dialog-description">
          <DialogHeader>
            <DialogTitle>Confirm Assignment</DialogTitle>
          </DialogHeader>
          <p id="dialog-description">
            You are about to assign to the term on <b>{selectedTerm?.day}</b> at{' '}
            <b>{selectedTerm?.time}</b>. Do you want to proceed?
          </p>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="default" onClick={() => {
              console.log(`Assigned to ${selectedTerm?.time} on ${selectedTerm?.day}`)
              selectedTerm?.id && assingSchedule({ params: { id: selectedTerm.id.toString() } });
              setShowModal(false)
            }}>
              Confirm
            </Button>
            <DialogDescription></DialogDescription>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AssignableCalendar

