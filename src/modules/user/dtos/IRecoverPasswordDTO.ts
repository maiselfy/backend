export default interface IRecoverPasswordDTO {
  token: string;
  password: string;
  passwordConfirm: string;
}
