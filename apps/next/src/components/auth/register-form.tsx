"use client"

import FormWrapper from "@/components/auth/form-wrapper";
import { zRegisterUserDto } from "@workspace/data";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";

const RegisterForm = () => {

  const form = useForm({
    resolver: zodResolver(zRegisterUserDto),
    defaultValues: {
      name: "",
      surname: "",
      aisId: 0,
      email: "",
      password: ""
    }
  })

  const onSubmit = (data : z.infer<typeof zRegisterUserDto>)=> {
    console.log(data)
  }

  return (
    <FormWrapper
    label = "Create an account"
    title = "Register"
    backLabel = "Already have an account?"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <FormField
              control = {form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                   <Input {...field} type="text" placeholder="Atrik" required/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control = {form.control}
              name="surname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Surname</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" placeholder="Pantal" required/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="aisId"
              render={({ field: { value, onChange } }) => (
                <FormItem>
                  <FormLabel>AIS ID</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="111111"
                      value={value}
                      onChange={(e)=>onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control = {form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="email@example.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control = {form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="******" required/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" className="w-full">
            Register
          </Button>
        </form>
      </Form>
    </FormWrapper>
  )
}

export default RegisterForm
