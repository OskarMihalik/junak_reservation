'use client'
import CreateScheduleForm from '@/components/admin/createScheduleForm'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { zodResolver } from '@hookform/resolvers/zod'
import { daysArray, RequestScheduleDto, zRequestScheduleDto } from '@workspace/data'
import React, { useMemo } from 'react'
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
  const addCheckboxes = () => {
    const date = currentDatesWeek[currentDatesWeek.length - 1]
    date.setDate(date.getDate() + 7)
    const nextWeek = getWeekDays(date).map(date => ({ date: getDate(date), checked: false }))
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
            interval: 5,
            capacity: 0,
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

  const onError = (errors, values) => {
    // Continue submitting invalid form values
    console.log('errors', errors)
    console.log('values', form.getValues())
  }

  const onSubmit = form.handleSubmit(onValid, onError)

  return (
    <Card className='flex-wrap'>
      <CardHeader>
        <CardTitle>Create schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex flex-wrap'>
          {fields.map((field, index) => (
            <CreateScheduleForm key={field.id} form={form} scheduleIndex={index} date={currentDatesWeek[index]} />
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onSubmit}>Create schedule</Button>
      </CardFooter>
    </Card>
  )
}

export default CreateSchedulePage
