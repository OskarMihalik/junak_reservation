import React from 'react'

type AuthCardHeaderProps = {
  label: string,
  title: string
}

const AuthCardHeader: React.FC<AuthCardHeaderProps> = ({label, title}) => {
  return (
    <div className="w-full flex flex-col gap-y-2 items-center justify-center">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  )
}

export default AuthCardHeader
