"use client"

import { zLoginUserDto } from "@workspace/data";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormWrapper from "@/components/auth/form-wrapper";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";

const LoginForm = () => {

  const form = useForm({
    resolver: zodResolver(zLoginUserDto),
    defaultValues: {
      email: "",
      password: "",
    }
  });

  const onSubmit = (data: z.infer<typeof zLoginUserDto> ) => {
    console.log(data)
  }

  return (
    <FormWrapper
    label = "Log into your account"
    title = "Login"
    backLabel = "Don't have an account? Register here"
    backRef = "../../auth/register"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <FormField
              control = {form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
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
            Log in
          </Button>
        </form>
      </Form>
    </FormWrapper>
  )
}

export default LoginForm
