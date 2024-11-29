import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core'

@Entity()
export class User {
  @PrimaryKey()
  id!: number

  @Property()
  isAdmin!: boolean

  @Unique()
  @Property()
  aisId!: number

  @Property()
  name!: string

  @Property()
  surname!: string

  @Unique()
  @Property()
  email!: string

  @Property()
  password!: string

  constructor(isAdmin: boolean, aisId: number, name: string, surname: string, email: string, password: string) {
    this.isAdmin = isAdmin;
    this.aisId = aisId;
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.password = password;
  }

}
