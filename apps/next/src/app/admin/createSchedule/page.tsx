'use client'
import CreateScheduleForm from '@/components/admin/createScheduleForm'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { DatePickerDemo } from '@/components/ui/datePicker'
import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import { daysArray, RequestScheduleDto, zRequestScheduleDto } from '@workspace/data'
import React, { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { getWeekDays } from '@workspace/common'
import { Button } from '@/components/ui/button'
import { useQueryClientContext } from '@/utils/providers/ReactQueryProvider'
import { useToast } from '@/hooks/use-toast'

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

  const currentDatesWeek = useMemo(() => {
    const weekDates = getWeekDays(new Date())
    return weekDates
  }, [])

  const [checkedMon, setCheckedMon] = React.useState(false)
  const [checkedTue, setCheckedTue] = React.useState(false)
  const [checkedWed, setCheckedWed] = React.useState(false)
  const [checkedThu, setCheckedThu] = React.useState(false)
  const [checkedFri, setCheckedFri] = React.useState(false)
  const [checkedSat, setCheckedSat] = React.useState(false)
  const [checkedSun, setCheckedSun] = React.useState(false)

  const formMon = useForm<RequestScheduleDto>({
    resolver: zodResolver(zRequestScheduleDto),
    defaultValues: {
      day: daysArray[0],
      date: currentDatesWeek[0].toISOString(),
      section: [
        {
          startAt: currentDatesWeek[0].toISOString(),
          interval: 5,
          capacity: 0,
          endAt: currentDatesWeek[0].toISOString(),
        },
      ],
    },
  })
  const formTue = useForm<RequestScheduleDto>({
    resolver: zodResolver(zRequestScheduleDto),
    defaultValues: {
      day: daysArray[1],
      date: currentDatesWeek[1].toISOString(),
      section: [
        {
          startAt: currentDatesWeek[1].toISOString(),
          interval: 5,
          capacity: 0,
          endAt: currentDatesWeek[1].toISOString(),
        },
      ],
    },
  })

  const formWed = useForm<RequestScheduleDto>({
    resolver: zodResolver(zRequestScheduleDto),
    defaultValues: {
      day: daysArray[2],
      date: currentDatesWeek[2].toISOString(),
      section: [
        {
          startAt: currentDatesWeek[2].toISOString(),
          interval: 5,
          capacity: 0,
          endAt: currentDatesWeek[2].toISOString(),
        },
      ],
    },
  })

  const formThu = useForm<RequestScheduleDto>({
    resolver: zodResolver(zRequestScheduleDto),
    defaultValues: {
      day: daysArray[3],
      date: currentDatesWeek[3].toISOString(),
      section: [
        {
          startAt: currentDatesWeek[3].toISOString(),
          interval: 5,
          capacity: 0,
          endAt: currentDatesWeek[3].toISOString(),
        },
      ],
    },
  })

  const formFri = useForm<RequestScheduleDto>({
    resolver: zodResolver(zRequestScheduleDto),
    defaultValues: {
      day: daysArray[4],
      date: currentDatesWeek[4].toISOString(),
      section: [
        {
          startAt: currentDatesWeek[4].toISOString(),
          interval: 5,
          capacity: 0,
          endAt: currentDatesWeek[4].toISOString(),
        },
      ],
    },
  })

  const formSat = useForm<RequestScheduleDto>({
    resolver: zodResolver(zRequestScheduleDto),
    defaultValues: {
      day: daysArray[5],
      date: currentDatesWeek[5].toISOString(),
      section: [
        {
          startAt: currentDatesWeek[5].toISOString(),
          interval: 5,
          capacity: 0,
          endAt: currentDatesWeek[5].toISOString(),
        },
      ],
    },
  })

  const formSun = useForm<RequestScheduleDto>({
    resolver: zodResolver(zRequestScheduleDto),
    defaultValues: {
      day: daysArray[6],
      date: currentDatesWeek[6].toISOString(),
      section: [
        {
          startAt: currentDatesWeek[6].toISOString(),
          interval: 5,
          capacity: 0,
          endAt: currentDatesWeek[6].toISOString(),
        },
      ],
    },
  })

  const onSubmit = () => {
    const checked = [checkedMon, checkedTue, checkedWed, checkedThu, checkedFri, checkedSat, checkedSun]
    const formValues = [
      { values: formMon.getValues(), checked: checked[0] },
      { values: formTue.getValues(), checked: checked[1] },
      { values: formWed.getValues(), checked: checked[2] },
      { values: formThu.getValues(), checked: checked[3] },
      { values: formFri.getValues(), checked: checked[4] },
      { values: formSat.getValues(), checked: checked[5] },
      { values: formSun.getValues(), checked: checked[6] },
    ]
      .filter(({ checked }) => checked)
      .map(({ values }) => ({ ...values, date: new Date(values.date).toISOString().split('T')[0] }))

    console.log(formValues)
    mutate({ body: formValues })
  }

  return (
    <Card className='flex-wrap'>
      <CardHeader>
        <CardTitle>Create schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex flex-wrap'>
          <CreateScheduleForm form={formMon} date={currentDatesWeek[0]} setCheckbox={setCheckedMon} />
          <CreateScheduleForm form={formTue} date={currentDatesWeek[1]} setCheckbox={setCheckedTue} />
          <CreateScheduleForm form={formWed} date={currentDatesWeek[2]} setCheckbox={setCheckedWed} />
          <CreateScheduleForm form={formThu} date={currentDatesWeek[3]} setCheckbox={setCheckedThu} />
          <CreateScheduleForm form={formFri} date={currentDatesWeek[4]} setCheckbox={setCheckedFri} />
          <CreateScheduleForm form={formSat} date={currentDatesWeek[5]} setCheckbox={setCheckedSat} />
          <CreateScheduleForm form={formSun} date={currentDatesWeek[6]} setCheckbox={setCheckedSun} />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onSubmit}>Create schedule</Button>
      </CardFooter>
    </Card>
  )
}

export default CreateSchedulePage
