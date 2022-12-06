import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddUserDto } from './dto/add-users.dto';
import { UpdateUserDto } from './dto/update-users.dto';
import { UsersEntity } from './entity/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>
  ){}

  /**
   * Function common for find an user by Id with relations or not
   * @param id number
   * @param account boolean
   * @returns UsersEntity
   */
  async findUserById(id: number, account: boolean = true): Promise<UsersEntity> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations : {
        account
      }
    });
    // if the userId doesn't exists
    if(!user) {
      throw new NotFoundException(`The user with id n° ${id} doesn't exists.`)
    }
    delete user.password;
    delete user.salt;
    return user;
  }

  /**
   * We get all Users with relations or not
   * @param accountId number
   * @param account boolean
   * @returns UserEntity[]
   */
  async getAllUsers(accountId: number): Promise<UsersEntity[]> {
    if(accountId === 1) {
      return await this.usersRepository.find();
    }
    return await this.usersRepository.find({
      where: { accountId }
    });
  }

  /**
   * we get one user with relation or not
   * @param id 
   * @param account boolean
   * @returns UsersEntity
   */
  async getOneUser(id: number, account: boolean = true): Promise<UsersEntity> {
    // search one user
    return await this.findUserById(id, account);
  }

  /**
   * we add a new user
   * @param user 
   * @returns UsersEntity
   */
  async addUser(user: AddUserDto): Promise<UsersEntity> {
    const email = await this.usersRepository.findOneBy({ 
      email: user.email
    });
    if(email) {
      throw new UnauthorizedException(`An user is already registered with the email ${user.email}`);
    }
    // we register the user
    const registeredUser = await this.usersRepository.save(user);
    // we return the user with account information
    return await this.findUserById(registeredUser.id);
  }

  /**
   * we modify an user
   * @param id 
   * @param user 
   * @returns UsersEntity
   */
  async updateUser(id: number, user: UpdateUserDto): Promise<UsersEntity> {
    // we retrieve the user by id and we replace the news values for user
    const newUser = await this.usersRepository.preload({
      id,
      ...user
    });
    // if the userId doesn't exists
    if(!newUser) {
      throw new NotFoundException(`The user with id n° ${id} doesn't exists.`)
    }
    // we save the updated user
    await this.usersRepository.save(newUser);
    return await this.findUserById(id);
  }

  /**
   * We delete an user in a soft way
   * @param id 
   * @returns response typeOrm : { generatedMaps: [], rax: [], affected: number }
   */
  async softDeleteUser(id: number) {
    return await this.usersRepository.softDelete(id);
  }

  /**
   * We restore an user when he has been deleted in a sotf way
   * @param id 
   * @returns response typeOrm : { generatedMaps: [], rax: [], affected: number }
   */
  async restoreUser(id: number) {
    // we restaure the user (softRemove)
    return await this.usersRepository.restore(id);
  }

  /**
   * we delete an user in a hard way
   * @param id 
   * @returns response typeOrm : { raw: [], affected: number }
   */
   async hardDeleteUser(id: number) {
    // check if it exists
    await this.findUserById(id, false);
    // we remove it
    return await this.usersRepository.delete(id);
    // we can send an aray to delete -> delete([4, 5, 12])
  }

}
