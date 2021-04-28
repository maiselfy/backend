import { Body, Controller, Param, Post } from '@nestjs/common';
import IRecoverPasswordDTO from 'src/user/dtos/IRecoverPasswordDTO';
import { ResetPasswordService } from 'src/user/services/resetPassword.service';
import { SendEmailWithTokenService } from 'src/user/services/sendEmailWithToken.service';

@Controller('recover-password')
export class RecoverPasswordController {
  constructor(
    private sendEmailWithTokenService: SendEmailWithTokenService,
    private resetPasswordService: ResetPasswordService,
  ) {}

  @Post('send-token/:email')
  sendEmail(@Param('email') email: string) {
    return this.sendEmailWithTokenService.execute(email);
  }

  @Post('reset-password/:token')
  resetPassword(
    @Param('token') token: string,
    @Body() { password }: IRecoverPasswordDTO,
  ) {
    this.resetPasswordService.execute(token, password);
  }
}
