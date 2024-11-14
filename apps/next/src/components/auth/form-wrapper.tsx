"use client"

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import AuthCardHeader from "@/components/auth/auth-card-header";

type FormWrapperProps = {
  label: string;
  title: string;
  backLabel: string;
  children: React.ReactNode
};

const FormWrapper: React.FC<FormWrapperProps> = ({ label, title, backLabel, children }) => {
  return (
    <Card className="xl:w-1/4 md:w-1/2 shadow-md">
      <CardHeader>
        <AuthCardHeader label={label} title={title} />
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
      <CardFooter className="justify-center text-center">
        {backLabel}
      </CardFooter>
    </Card>
  )
}

export default FormWrapper
