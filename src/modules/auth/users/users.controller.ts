import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { User } from 'src/generics/decorators/user.decorators';
import { AccountsService } from '../accounts/accounts.service';
import { JwtAuthGuard } from '../guards/jwt-auth-guard';
import { AddUserDto } from './dto/add-users.dto';
import { UpdateUserDto } from './dto/update-users.dto';
import { UsersEntity } from './entity/users.entity';
import { UsersService } from './users.service';

// const s3 = new S3();
// const BUCKET_NAME = process.env.AWS_S3_BUCKET;

@Controller('api/users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private accountsService: AccountsService,
    private usersService: UsersService
  ) {}

  /**
   * we retrieve all users
   * @returns UsersEntity[]
   */
   @Get('')
   async getAllUsers(
     @User() requester: UsersEntity
   ): Promise<UsersEntity[]> {
     /*
       Either by using the Request method, or by using the custom decorator @Get()
       We get the currentUser (requester) and i can verify role for each action :
       1. accountId === requester.accountId
       2. if(requester.role === usersRole.ADMIN) {}
       3. ...
     */
     const accountId = requester.accountId;
    
     // we check if an account exists
     await this.accountsService.findAccountById(accountId);
     // we retrieve all users
     return await this.usersService.getAllUsers(accountId);
   }

   /**
    * we add a new user
    * @param user 
    * @returns UsersEntity
    */
   @Post()
   async AddUser( @Body() user: AddUserDto ): Promise<UsersEntity> {
     return await this.usersService.addUser(user);
   }

   /**
    * we delete an user in a soft way
    * @param id 
    * @returns response typeOrm : { generatedMaps: [], rax: [], affected: number }
    */
   @Delete('/soft/:id')
   async softDeleteUser(@Param('id', ParseIntPipe) id: number) {
     return await this.usersService.softDeleteUser(id);
   }

   /**
    * we restore an user when he has been deleted in a soft way
    * @param id 
    * @returns response typeOrm : { generatedMaps: [], rax: [], affected: number }
    */
   @Get('/restore/:id')
   async restoreUser(@Param('id', ParseIntPipe) id: number) {
     return await this.usersService.restoreUser(id);
   }

   /**
    * we get one User
    * @param id 
    * @param relation 
    * @returns UsersEntity
    */
   @Get('/:id')
   async getOneUser(
     @Param('id', ParseIntPipe) id: number,
     ) {
     return await this.usersService.getOneUser(id);
   }

   /**
    * We modify an user
    * @param user 
    * @param id 
    * @returns UsersEntity
    */
  //  @Patch('/:id')
  //  @UseInterceptors(FileInterceptor('image'))
  //  async updateUser( 
  //    @Body() user: UpdateUserDto,
  //    @Param('id', ParseIntPipe) id: number,
  //    @UploadedFile() file: Express.Multer.File,
  //    @User() requester: UsersEntity
  //    ) {
  //    if(file) {
  //      const userExist = await this.usersService.findUserById(id);
  //      if(userExist.imageUrl) {
  //        await s3.deleteObject({
  //          Bucket: BUCKET_NAME,
  //          Key: userExist.imageUrl.split('amazonaws.com/')[1],
  //        }).promise();
  //      }
  //      const compartiment = process.env.NODE_ENV === 'production' ? '' : 'test/'
  //      const folder = 'users/avatar/'
 
  //      const MIME_TYPES = {
  //        'image/jpg': 'jpg',
  //        'image/jpeg': 'jpg',
  //        'image/png': 'png'
  //      }
 
  //      const extension = MIME_TYPES[file.mimetype];
 
  //      const filename = compartiment + folder + file.originalname + Date.now() + extension;
 
  //      // Upload File from S3
  //      const params = {
  //        Key : filename,
  //        Body : file.buffer,
  //        Bucket: BUCKET_NAME,
  //        ACL: 'public-read',
  //      }
  //      const upload = new Promise((resolve, reject) => {
  //        s3.upload(params, (err, data) => {
  //          if(err) {
  //            console.log(err)
  //            reject(false)
  //          } else {
  //            resolve(data)
  //          }
  //        })
  //      })
  //      return upload
  //      .then(async(response: any) => {
  //        user.imageUrl = response.Location
  //        return await this.usersService.updateUser(id, user);
  //      })
  //      .catch(error => {
  //        throw new Error(`Error dring uploading file ${error}`)
  //      })
  //    } else {
  //      return await this.usersService.updateUser(id, user);
  //    }
  //  }
   
   /**
    * we delete an user in a hard way
    * @param id 
    * @returns response typeOrm : { raw: [], affected: number }
    */
   @Delete('/:id')
   async hardDeleteUser(@Param('id', ParseIntPipe) id: number) {
     return this.usersService.hardDeleteUser(id);
   }
}
