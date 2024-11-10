import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core'

@Entity()
export class User {
  @PrimaryKey()
  id!: number

  @Property()
  fullName!: string

  @Unique()
  @Property()
  email!: string

  @Property()
  password!: string
}
