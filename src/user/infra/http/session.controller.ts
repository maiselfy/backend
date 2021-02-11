import { Controller, Get } from '@nestjs/common';

@Controller('session')
export class SessionController {
    @Get()
    test(){
        return {
            "status": "Ok"
        }
    }
}
