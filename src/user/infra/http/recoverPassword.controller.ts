import { Controller, Param, Post } from '@nestjs/common';
import { SendEmailWithTokenService } from 'src/user/services/sendEmailWithToken.service';

@Controller('recover-password')
export class RecoverPasswordController {
  constructor(private sendEmailWithTokenService: SendEmailWithTokenService) {}

  @Post('send-email/:email')
  sendEmail(@Param('email') email: string) {
    return this.sendEmailWithTokenService.execute(email);
  }
}
