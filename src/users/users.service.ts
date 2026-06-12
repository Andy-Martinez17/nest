import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from "bcrypt"

@Injectable()
export class UsersService {
  constructor(
      @InjectRepository(User)
      private userRepository: Repository<User>,
    ) {}
  async create(registerDto: RegisterDto) {
    const exist= await this.userRepository.findOne({where:{email: registerDto.email}});
    if (exist) throw new ConflictException('El email esta registrado') 
   const hashed= await bcrypt.hash(registerDto.password,10);

    const newuser= this.userRepository.create({...User, password:hashed})
    return this.userRepository.save(newuser);
  }

  async findByEmail(email: string) {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  async findById(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
