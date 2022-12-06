import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UsersEntity } from "../users/entity/users.entity";
import { payloadInterface } from "../interfaces/payload.interfaces";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('SECRET') 
    });
  }

  async validate(payload: payloadInterface): Promise<UsersEntity> {
    // we retrieve the user
    const user = await this.usersRepository.findOne({
      where: { id: payload.userId },
      relations: { account: true } 
    });
    // if the user is not found
    if(!user) {
      throw new UnauthorizedException();
    }
    // we remove password and salt
    delete user.password;
    delete user.salt;
    return user;
  }
}