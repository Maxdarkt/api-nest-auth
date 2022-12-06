import { TimestampEntities } from "src/generics/entities/timestamp.entities";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { AccountsEntity } from "../../accounts/entity/accounts.entity";
import { usersRole } from "../enum/users.enum";

@Entity('Users')
export class UsersEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 55,
    nullable: true, 
    default: null
  })
  matricule: string;

  @Column({
    type: 'varchar',
    length: 55,
  })
  lastname: string;

  @Column({
    type: 'varchar',
    length: 55,
  })
  firstname: string;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    default: null
  })
  password: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    default: null
  })
  salt: string;

  @Column({
    type: 'varchar',
    length: 11,
    nullable: true,
    default: null
  })
  mobile: string;

  @Column({
    nullable: true,
    default: null
  })
  birthDate: Date;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    default: null
  })
  complement: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    default: null
  })
  address: string;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: true,
    default: null
  })
  postal: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    default: null
  })
  city: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    default: null
  })
  country: string;

  @Column({
    type: 'enum',
    enum: usersRole,
    default: usersRole.USER
  })
  role: usersRole;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    default: null
  })
  imageUrl: string;

  @Column({
    nullable: true,
    default: false
  })
  isValidatedEmail: boolean;

  // Relation for Users <-> Position
  // @ManyToOne(
  //   type => PositionsEntity,
  //   (position) => position.users,
  //   {
  //     onDelete: 'CASCADE'
  //   }
  // )
  // @JoinColumn({
  //   name: "positionId",
  // })
  // position: PositionsEntity;
  // @Column({
  //   nullable: true, 
  //   default: null
  // })
  // positionId: number;

  // Relation for Users <-> Account : accountId && account
  @ManyToOne(
    type => AccountsEntity,
    (account) => account.users,
    {
      onDelete: 'CASCADE'
    }
  )
  @JoinColumn({
    name: "accountId",
  })
  account: AccountsEntity;
  @Column({
    nullable: false
  })
  accountId: number;

  // import createdAt, updatedAt, deletedAt
  @Column(() => TimestampEntities)
  'timesTamp': TimestampEntities
  
}
