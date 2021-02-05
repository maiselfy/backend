import Body from '../infra/typeorm/entities/Body';

export default interface ICreateUserDTO {
  name: string;
  lastname: string;
  email: string;
  password: string;
  birthdate: Date;
  body: Body;
}
