'use client'
import CreateScheduleForm from '@/components/admin/createScheduleForm'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkBox'
import { DatePickerDemo } from '@/components/ui/datePicker'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TimePickerInput } from '@/components/ui/timePicker'
import { TimePickerDemo } from '@/components/ui/timePickerDemo'
import { zodResolver } from '@hookform/resolvers/zod'
import { RequestScheduleDto, zRequestScheduleDto } from '@workspace/data'
import Link from 'next/link'
import React, { useMemo } from 'react'
import { useForm } from 'react-hook-form'

const CreateSchedulePage = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  const currentDate = useMemo(() => {
    return new Date()
  }, [])

  const formMon = useForm<RequestScheduleDto>({
    resolver: zodResolver(zRequestScheduleDto),
    defaultValues: {
      day: 'MON',
      date: currentDate?.toISOString(),
      section: [{ startAt: '2024-11-24T10:00:00.000Z', interval: 5, capacity: 0, endAt: '2024-11-24T00:00:00.000Z' }],
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col my-4'>
          <Label>Date of the monday</Label>
          <DatePickerDemo />
        </div>
        <div className='flex'>
          <CreateScheduleForm form={formMon} day='Monday' />
          <CreateScheduleForm form={formMon} day='Tuesday' />
        </div>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  )
}

export default CreateSchedulePage
