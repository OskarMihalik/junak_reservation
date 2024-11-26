'use client'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkBox'
import { DatePickerDemo } from '@/components/ui/datePicker'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TimePickerDemo } from '@/components/ui/timePickerDemo'
import { RequestScheduleDto } from '@workspace/data'
import React from 'react'
import { useFieldArray, UseFormReturn } from 'react-hook-form'

export type Props = {
  form: UseFormReturn<
    {
      schedules: RequestScheduleDto[]
    },
    any,
    undefined
  >
  date: Date
  setCheckbox: (value: boolean) => void
  scheduleIndex: number
}

const CreateScheduleForm = (props: Props) => {
  const { form } = props

  const { fields, append } = useFieldArray({
    control: props.form.control,
    name: `schedules.${props.scheduleIndex}.section`,
  })

  return (
    <Form {...form}>
      <form className='m-5'>
        <div className='flex'>
          <div className='flex flex-col'>
            <label
              htmlFor='mon-check'
              className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            >
              {props.date.toDateString()}
            </label>
            <Checkbox id='mon-check' onCheckedChange={state => props?.setCheckbox?.(state as boolean)} />
            {fields.map((field, index) => (
              <div key={field.id}>
                <FormField
                  control={form.control}
                  name={`schedules.${props.scheduleIndex}.section.${index}.startAt`}
                  render={({ field, fieldState, formState }) => (
                    <FormItem>
                      <FormLabel>Start at</FormLabel>
                      <FormControl>
                        <TimePickerDemo
                          {...field}
                          setDate={date => {
                            console.log('date', date)
                            field.onChange(date?.toISOString())
                          }}
                          date={new Date(field.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`schedules.${props.scheduleIndex}.section.${index}.interval`}
                  render={({ field, fieldState, formState }) => (
                    <FormItem>
                      <FormLabel>Interval</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='5'
                          value={field.value}
                          onChange={e => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`schedules.${props.scheduleIndex}.section.${index}.capacity`}
                  render={({ field, fieldState, formState }) => (
                    <FormItem>
                      <FormLabel>Capacity</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='5'
                          value={field.value}
                          onChange={e => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`schedules.${props.scheduleIndex}.section.${index}.endAt`}
                  render={({ field, fieldState, formState }) => (
                    <FormItem>
                      <FormLabel>End at</FormLabel>
                      <FormControl>
                        <TimePickerDemo
                          {...field}
                          setDate={date => field.onChange(date?.toISOString())}
                          date={new Date(field.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>
        </div>
      </form>
    </Form>
  )
}

export default CreateScheduleForm
