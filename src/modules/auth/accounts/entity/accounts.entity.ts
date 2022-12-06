import { TimestampEntities } from "src/generics/timestamp.entities";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UsersEntity } from "../../users/entity/users.entity";
import { companyStatus, currency } from "../enum/accounts.enum";

@Entity('Accounts')
export class AccountsEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 55,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 55,
  })
  division: string;

  @Column({
    type: 'varchar',
    length: 55,
    nullable: true,
    default: null
  })
  complement: string;

  @Column({
    type: 'varchar',
    length: 55,
  })
  address: string;

  @Column({
    type: 'varchar',
    length: 10,
  })
  postal: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  city: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  country: string;

  @Column({
    type: 'varchar',
    length: 55,
    nullable: true,
    default: null
  })
  companyMatricule: string;

  @Column({
    type: 'enum',
    enum: companyStatus,
    nullable: true,
    default: null
  })
  companyStatus: companyStatus;

  @Column({
    type: 'enum',
    enum: currency
  })
  currency: currency;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    default: null
  })
  logoUrl: string;

  @Column({
    nullable: true,
    default: false
  })
  isValidatedAccount: boolean;

  // Relation for Account <-> Users
  @OneToMany(
    type => UsersEntity,
    (user) => user.account,
    {
      nullable: true,
    }
  )
  users: UsersEntity[];

  @Column(() => TimestampEntities)
  'timesTamp': TimestampEntities

}