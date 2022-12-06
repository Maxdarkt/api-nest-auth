import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginCredentialsDto } from './dto/login-credentials.dto';
import { UsersEntity } from './users/entity/users.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
    private jwtService: JwtService
  ) {}
  
  /**
   * we login an user
   * @param credentials 
   * @returns user: UsersEntity, message: string, access_token: string
   */
  async login(credentials: LoginCredentialsDto) {

    const { email, password } = credentials;
    // we search an user with the email
    const user = await this.usersRepository.findOne({
      where: { email },
      relations: {
        account: true
      }
    });
    // if no user is found
    if(!user) {
      throw new NotFoundException(`No user account with this email address`);
    }
    // we compare password
    const passwordHashed = await bcrypt.hash(password, user.salt);
    if(passwordHashed !== user.password) {
      throw new UnauthorizedException(`Password incorrect`);
    }
    // we create a payload for token
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      accountId: user.accountId
    }
    // we generate a jwt
    const jwt = await this.jwtService.sign(payload);
    // we delete password and salt
    delete user.password;
    delete user.salt;
    // we save the user
    return {
      user,
      "message": 'Successfuly login',
      "accessToken": jwt
    }
  }
}
