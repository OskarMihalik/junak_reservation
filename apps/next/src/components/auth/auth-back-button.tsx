import React from 'react'
import {Button} from "@/components/ui/button";
import Link from "next/link";

type AuthCardHeaderProps = {
  label: string,
  ref: string
}

const AuthBackButton: React.FC<AuthCardHeaderProps> = ({label, ref}) => {
  return (
    <Button variant="link" className="font-normal w-full" size="sm" asChild>
      <Link href={ref}>
        {label}
      </Link>
    </Button>
  )
}

export default AuthBackButton
