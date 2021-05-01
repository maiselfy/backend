import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

export const mailerConfig: MailerOptions = {
  transport: {
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: Boolean(process.env.MAIL_SECURE),
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  },
  template: {
    dir: path.resolve(__dirname, '..', '..', '..', 'templates'),
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
};
