import { Food } from './entities/food.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { Repository } from 'typeorm';

@Injectable()
export class FoodsService {
  constructor(
    @InjectRepository(Food)
    private foodRepository: Repository<Food>,
  ) {}

  async create(createFoodDto: CreateFoodDto) {
    const food= this.foodRepository.create(createFoodDto);
    return this.foodRepository.save(food);
  }

  async findAll() {
    return `This action returns all foods`;
  }

   async findOne(id: number) {
    const food = this.foodRepository.findOneBy({id:id});
    if(!food){
      throw new NotFoundException(`No se encontro la comida con el ID: ${id}`)
    }
    return food;
  }

  async update(id: number, updateFoodDto: UpdateFoodDto) {
    const food = await this.foodRepository.findOneBy({id:id});
     if(!food){
      throw new NotFoundException(`No se encontro la comida con el ID: ${id}`)
    }
    const updateFood= this.foodRepository.merge(food,updateFoodDto);
    return this.foodRepository.save(updateFood);
  }

   async remove(id: number) {
    const food =await this.foodRepository.findOneBy({id:id});
    if(!food){
      throw new NotFoundException(`No se encontro la comida con el ID: ${id}`)
    }
    await this.foodRepository.delete(id)
    return {message: `comida con el id ${id} eliminados`}
  }
}