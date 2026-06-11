export class ResponseUserDto {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;

  constructor(
    firstName: string,
    lastName: string,
    email: string,
    id?: string,
    role?: string,
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.role = role;
  }
}
