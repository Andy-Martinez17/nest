import { JwtService } from '@nestjs/jwt';
import { UsersService } from './../../users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from 'src/users/dto/login.dto';
import * as bcrypt from "bcrypt"
import { access } from 'fs';

@Injectable()
export class AuthService {
    constructor(private UsersService:UsersService, private jwtservice: JwtService){
    }
    async login( logindto: LoginDto){
        const user= await this.UsersService.findByEmail(
            logindto.email
        );
        if(!user) throw new UnauthorizedException('credenciales invalidas');
        const match=await bcrypt.compare(logindto.password, user.password)
        if(!match) throw new UnauthorizedException('credenciales invalidas');
        const payload= {
            sub:user.id,
            email: user.email
            
        }
        return{
            access_token: this.jwtservice.sign(payload),
            user:{id:user.id, email:user.email, name: user.name}
        }
        
    }
}
