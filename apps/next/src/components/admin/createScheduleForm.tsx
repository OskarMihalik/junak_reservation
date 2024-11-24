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
  form: UseFormReturn<RequestScheduleDto, any, undefined>
  day: string
}

const CreateScheduleForm = (props: Props) => {
  const { form } = props

  const { fields, append } = useFieldArray({
    control: props.form.control,
    name: 'section',
  })

  return (
    <Form {...form}>
      <form>
        <div className='flex'>
          <div className='flex flex-col'>
            <label
              htmlFor='mon-check'
              className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            >
              {props.day}
            </label>
            <Checkbox id='mon-check' />
            {fields.map((field, index) => (
              <div key={field.id}>
                <FormField
                  control={form.control}
                  name={`section.${index}.startAt`}
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
                  name={`section.${index}.interval`}
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
                  name={`section.${index}.capacity`}
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
                  name={`section.${index}.endAt`}
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

{
  /* <FormField
                  control={form.control}
                  name='from'
                  render={({ field, fieldState, formState }) => (
                    <FormItem>
                      <FormLabel>From</FormLabel>
                      <FormControl>
                        <TimePickerDemo {...field} setDate={date => form.setValue('from', date)} date={field.value} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='interval'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interval</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger id='duration'>
                          <SelectValue placeholder='Duration' />
                        </SelectTrigger>
                        <SelectContent position='popper'>
                          <SelectItem value='60'>60</SelectItem>
                          <SelectItem value='30'>30</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='to'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>To</FormLabel>
                      <FormControl>
                        <TimePickerDemo {...field} setDate={date => form.setValue('to', date)} date={field.value} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='capacity'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacity</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='10'
                          value={field.value}
                          onChange={e => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */
}
