import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Tag from '../infra/typeorm/entities/Tag';

@Injectable()
class ListTagsForUserService {
  constructor(@InjectRepository(Tag) private tagService: Repository<Tag>) {}

  async execute(finance_id: string): Promise<Tag[]> {
    try {
      const tags = await this.tagService.find({ where: { finance_id } });

      return tags;
    } catch (error) {
      if (error) throw error;
      throw new HttpException(
        'Sorry, this operation could not be performed, please try again.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

export default ListTagsForUserService;
