'use client'
import CreateScheduleForm from '@/components/admin/createScheduleForm'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { zodResolver } from '@hookform/resolvers/zod'
import { daysArray, RequestScheduleDto, zRequestScheduleDto } from '@workspace/data'
import React, { useMemo, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { getWeekDays } from '@workspace/common'
import { Button } from '@/components/ui/button'
import { useQueryClientContext } from '@/utils/providers/ReactQueryProvider'
import { useToast } from '@/hooks/use-toast'
import { z } from 'zod'

export type CheckDate = {
  date: string
  checked: boolean
}

export const getDate = (date?: Date) => {
  if (date) {
    return date.toISOString().split('T')[0]
  }
  return new Date().toISOString().split('T')[0]
}

const CreateSchedulePage = () => {
  const client = useQueryClientContext()
  const { toast } = useToast()

  const { data, mutate, isPending } = client.adminSchedule.createWeekScheduleAsync.useMutation({
    onSuccess(data, _variables, _context) {
      if (data.status === 201) {
        toast({ description: 'Week created successfully' })
      }
    },
    onError(_error, _variables, _context) {
      toast({ description: 'Week creation failed' })
    },
  })
  const [checkedDates, setCheckedDates] = React.useState<CheckDate[]>([])

  const currentDatesWeek = useMemo(() => {
    const weekDates = getWeekDays(new Date())
    setCheckedDates(weekDates.map(date => ({ date: getDate(date), checked: false })))
    return weekDates
  }, [])

  // add checkboxes like this
  const addNewWeek = () => {
    const date = new Date(checkedDates[checkedDates.length - 1].date)
    date.setDate(date.getDate() + 7)
    const nextWeek = getWeekDays(date).map(date => ({ date: getDate(date), checked: false }))
    const newDefaultValues = nextWeek.map((date, index) => ({
      day: daysArray[index],
      date: date.date,
      section: [
        {
          startAt: new Date(date.date).toISOString(),
          interval: 60,
          capacity: 10,
          endAt: new Date(date.date).toISOString(),
        },
      ],
    }))
    debugger
    append(newDefaultValues)
    setCheckedDates([...checkedDates, ...nextWeek])
  }

  const form = useForm<{ schedules: RequestScheduleDto[] }>({
    resolver: zodResolver(
      z.object({
        schedules: z.array(zRequestScheduleDto),
      }),
    ),
    defaultValues: {
      schedules: currentDatesWeek.map((date, index) => ({
        day: daysArray[index],
        date: getDate(date),
        section: [
          {
            startAt: new Date(date).toISOString(),
            interval: 60,
            capacity: 10,
            endAt: new Date(date).toISOString(),
          },
        ],
      })),
    },
  })
  console.log('form', form)
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'schedules',
  })

  const onValid = (data: { schedules: RequestScheduleDto[] }) => {
    const formValues = data.schedules.filter(schedule =>
      checkedDates.find(check => check.checked && check.date === schedule.date),
    )

    console.log(formValues)
    mutate({ body: formValues })
  }

  const onSubmit = form.handleSubmit(onValid)
  const [page, setPage] = useState(0)
  const [maxPage, setMaxPage] = useState(0)
  const goNextWeek = () => {
    if (page + 1 > maxPage) {
      addNewWeek()
      setMaxPage(maxPage + 1)
    }
    setPage(page + 1)
  }

  const goBackWeek = () => {
    if (page - 1 < 0) {
      return
    }
    setPage(page - 1)
  }

  const showSchedule = (index: number) => {
    const limit = 7
    return index >= page * limit && index < (page + 1) * limit
  }

  return (
    <Card className='flex-wrap'>
      <CardHeader>
        <CardTitle>Create schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex flex-wrap'>
          {fields.map(
            (field, index) =>
              showSchedule(index) && (
                <CreateScheduleForm
                  key={field.id}
                  form={form}
                  field={field}
                  scheduleIndex={index}
                  setCheckbox={value => {
                    setCheckedDates(
                      checkedDates.map(check => (field.date === check.date ? { ...check, checked: value } : check)),
                    )
                  }}
                />
              ),
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onSubmit}>Create schedule</Button>
        <div className='ml-auto'>
          <Button onClick={goBackWeek} className='mr-5' disabled={page === 0}>
            Go week back
          </Button>
          <Button onClick={goNextWeek}>Next week</Button>
        </div>
      </CardFooter>
    </Card>
  )
}

export default CreateSchedulePage
