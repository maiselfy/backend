import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import User from 'user/typeorm/entities/User.entity';
@Injectable()
class CreateUserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}
}
export default CreateUserService;
