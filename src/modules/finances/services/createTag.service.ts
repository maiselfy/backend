import { HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import ICreateTagDTO from '../dto/ICreateTagDTO';
import Tag from '../infra/typeorm/entitites/Tag';

class CreateTagService {
  constructor(@InjectRepository(Tag) private tagRepository: Repository<Tag>) {}

  async execute({ name, color, icon }: ICreateTagDTO): Promise<Tag> {
    try {
      const tag = await this.tagRepository.create({ name, color, icon });

      await this.tagRepository.save(tag);

      return tag;
    } catch (error) {
      if (error) throw error;
      throw new HttpException(
        'Sorry, this operation could not be performed, please try again.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

export default CreateTagService;
