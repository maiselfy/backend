import { Body, Controller, Param, Post } from '@nestjs/common';
import IRecoverPasswordDTO from 'src/modules/user/dtos/IRecoverPasswordDTO';
import ISendEmailWithToken from 'src/modules/user/dtos/ISendEmailWithToken';
import { ResetPasswordService } from 'src/modules/user/services/resetPassword.service';
import { SendEmailWithTokenService } from 'src/modules/user/services/sendEmailWithToken.service';

@Controller('recover-password')
export class RecoverPasswordController {
  constructor(
    private sendEmailWithTokenService: SendEmailWithTokenService,
    private resetPasswordService: ResetPasswordService,
  ) {}

  @Post('send-token')
  sendEmail(@Body() { email }: ISendEmailWithToken) {
    return this.sendEmailWithTokenService.execute(email);
  }

  @Post('reset-password/:token')
  resetPassword(
    @Param('token') token: string,
    @Body() { password, passwordConfirm }: IRecoverPasswordDTO,
  ) {
    this.resetPasswordService.execute(token, password, passwordConfirm);
  }
}
