import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import User from '../infra/typeorm/entities/User';
import { ICreateSessionDTO } from '../dtos/ICreateSessionDTO';
import { BCryptHashProvider } from '../providers/HashProvider/implementations/BCryptHashProvider';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import { JwtService } from '@nestjs/jwt'

@Injectable()
export default class Service {
    constructor(@InjectRepository(User) private usersRepository: Repository<User>,
    @Inject(BCryptHashProvider) private readonly HashProvider: IHashProvider,
    private JwtService: JwtService){}

    async execute({ email, password }: ICreateSessionDTO){
        const userExists = await this.usersRepository.findOne({ where: { email } });

        if (!userExists) {
            throw new Error('This email does not exist in the database.');
        }

        const verify = await this.HashProvider.compareHash(password, userExists.password)

        if(verify){
            const name = userExists.name
            const lastname = userExists.lastname
            const birthdate = userExists.birthdate

            return {
                "acess_token": this.JwtService.sign({ 
                    name, 
                    lastname, 
                    birthdate 
                })
            }
        }else{
            throw new Error('Incorrect password.')
        }
    }
}
