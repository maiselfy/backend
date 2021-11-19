import { Body, Controller, Post } from '@nestjs/common';
import IRecoverPasswordDTO from 'src/modules/user/dtos/IRecoverPasswordDTO';
import ISendEmailWithToken from 'src/modules/user/dtos/ISendEmailWithToken';
import { ResetPasswordService } from 'src/modules/user/services/resetPassword.service';
import { SendEmailWithTokenService } from 'src/modules/user/services/sendEmailWithToken.service';

@Controller('forgot-password')
export class RecoverPasswordController {
  constructor(
    private sendEmailWithTokenService: SendEmailWithTokenService,
    private resetPasswordService: ResetPasswordService,
  ) {}

  @Post()
  sendEmail(@Body() { email }: ISendEmailWithToken) {
    return this.sendEmailWithTokenService.execute(email);
  }

  @Post('reset-password')
  resetPassword(
    @Body() { token, password, passwordConfirm }: IRecoverPasswordDTO,
  ) {
    return this.resetPasswordService.execute(token, password, passwordConfirm);
  }
}
