import { Body, Controller, Post } from '@nestjs/common';
import { ICreateSessionDTO } from 'src/modules/user/dtos/ICreateSessionDTO';
import AuthenticateUserService from '../../services/authenticateUser.service';

@Controller('session')
export class SessionController {
  constructor(private authenticateUserService: AuthenticateUserService) {}
  @Post()
  async createSession(@Body() { email, password }: ICreateSessionDTO) {
    const session = await this.authenticateUserService.execute({
      email,
      password,
    });

    return session;
  }
}
