import { Controller, Post } from '@nestjs/common';

@Controller('session')
export class SessionController {
    @Post()
    createSession(){
        return {
            "status": "Ok"
        }
    }
}
