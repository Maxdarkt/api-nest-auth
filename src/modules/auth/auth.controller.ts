import { Body, Controller, Get, HttpCode, Post, UseGuards } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/generics/decorators/user.decorators";
import { Repository } from "typeorm";
import { AccountsService } from "./accounts/accounts.service";
import { AddAccountDto } from "./accounts/dto/add-accounts.dto";
import { AuthService } from "./auth.service";
import { LoginCredentialsDto } from "./dto/login-credentials.dto";
import { JwtAuthGuard } from "./guards/jwt-auth-guard";
import { AddUserDto } from "./users/dto/add-users.dto";
import { UsersEntity } from "./users/entity/users.entity";
import { UsersService } from "./users/users.service";
import * as bcrypt from 'bcrypt';

@Controller('api/auth')
export class AuthController {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
    private accountService: AccountsService,
    private usersService: UsersService,
    private authService: AuthService
  ) {}
  
  /**
   * We register a new account and a user
   * @param userData 
   * @param accountData 
   * @returns UsersEntity
   */
  @Post('/signup')
  async signup(
    @Body('user') userData: AddUserDto,
    @Body('account') accountData: AddAccountDto): Promise<UsersEntity> {
    // we register the account  
    const account = await this.accountService.addAccount(accountData);
    if(!account) {
      throw new Error(`An error has occurred. Please try again later.`);
    }
    // we create a new user
    const user = this.usersRepository.create({
      ...userData
    });
    // we generate a salt
    user.salt = await bcrypt.genSalt();
    // we hash password
    user.password = await bcrypt.hash(user.password, user.salt);
    // we add the accountId
    user.accountId = account.id;

    try {
      // we get the registeredUser with account information
      const registeredUser =  await this.usersService.addUser(user);
      // we delete password and salt
      delete registeredUser.password;
      delete registeredUser.salt;

      return registeredUser;

    } catch(e) {
      console.log(e);
      // if we get an error we delete account if he exists
      if(account) {
        await this.accountService.hardDeleteAccount(account.id);
      }
      // if we get an error we delete user if he exists
      if(user) {
        await this.usersService.hardDeleteUser(user.id);
      }
      throw new Error(`An error has occurred. Please try again later.`)
    }
  }

  /**
   * we login an user
   * @param credentials 
   * @returns user: UsersEntity, message: string, access_token: string
   */
  @HttpCode(200)
  @Post('/login')
  async login(
    @Body() credentials: LoginCredentialsDto) {
    return await this.authService.login(credentials);
  }

  @Get('/profil')
  @UseGuards(JwtAuthGuard)
  async getProfil(
  @User() requester
  ): Promise<UsersEntity> {
    console.log(requester)
    return requester;
  }
}
