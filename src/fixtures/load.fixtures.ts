import { mysqlOptions } from "ormconfig";
import { AccountsEntity } from "src/modules/auth/accounts/entity/accounts.entity";
import { UsersEntity } from "src/modules/auth/users/entity/users.entity";
import { DataSource } from "typeorm";
import { mockAccounts } from "./mocks/accounts.mocks";
import { mockUsers } from "./mocks/users.mocks";
import * as bcrypt from 'bcrypt';

/**
 * We transform mockData into entity and we save it into Db
 * @param appDataSource 
 * @param mockData 
 * @param tableEntity 
 * @returns 
 */
const addMocks = async(appDataSource: DataSource, mockData, tableEntity) => {
  // we create queryRunner instance
  const queryRunner = appDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try{
    // we load a mock and return entity[]
    let data = []
    // we transform mockData into entity
    const mocks =  mockData.map((data) => {
      const entity = new tableEntity();
      Object.assign(entity, data)
      return entity;
    })
    // we register each item
    for (const mock of mocks) {
      await queryRunner.manager.save(mock);
      data.push(mock);
    }
    await queryRunner.commitTransaction();
    return data;

  } catch(e) {
    console.log(e);
    // since we have errors lets rollback the changes we made
    await queryRunner.rollbackTransaction();
  }
  finally {
    // you need to release a queryRunner which was manually instantiated
    await queryRunner.release();
  }
}

/**
 * we delete all the database (all the tables)
 * @param appDataSource 
 * @param table 
 */
const cleanDatabase = async(appDataSource: DataSource, table: string) => {
  // we create queryRunner instance
  const queryRunner = appDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try{
    // we delete all the database in !!! local mode !!!
    await queryRunner.clearDatabase(table);
    await queryRunner.commitTransaction();

  } catch(e) {
    console.log(e);
    // since we have errors lets rollback the changes we made
    await queryRunner.rollbackTransaction();
  }
  finally {
    // you need to release a queryRunner which was manually instantiated
    await queryRunner.release();
  }
}

/**
 * Array for load all the mocks
 * name : The name of the mocks for message information
 * mockData : The mockData to be loaded
 * entity : the entity for the mockData
 */
const allMocks = [
  {
    name: 'accounts',
    mockData: mockAccounts,
    entity: AccountsEntity
  },
  // {
  //   name: 'districts',
  //   mockData: mockDistricts,
  //   entity: DistrictsEntity
  // },
  // {
  //   name: 'positions',
  //   mockData: mockPositions,
  //   entity: PositionsEntity
  // },
  {
    name: 'users',
    mockData: mockUsers,
    entity: UsersEntity
  }
];

// const allMocksOthers = [
//   {
//     name: 'USERS_HAS_CURRENT_WORKSITES',
//     fieldOne: 'userId',
//     fieldTwo: 'worksiteId',
//     mockData: mockUsersHasCurrentWorksites
//   },
//   {
//     name: 'USERS_HAS_OLD_WORKSITES',
//     fieldOne: 'userId',
//     fieldTwo: 'worksiteId',
//     mockData: mockUsersHasOldWorksites
//   },
//   {
//     name: 'MOA_HAS_CONTACTS',
//     fieldOne: 'moaId',
//     fieldTwo: 'contactId',
//     mockData: mockMoaHasContacts
//   }
// ]

const loadMocks = async(AppDataSource, mockData, entity, name: string) => {
  if(name === 'users') {
    for(let user of mockData) {
      // we generate a salt
      user.salt = await bcrypt.genSalt();
      console.log('salt :', user.salt);
      // we hash password
      user.password = await bcrypt.hash(user.password, user.salt);
      console.log('password :', user.password);
    }
  }
  const data = await addMocks(AppDataSource, mockData,  entity);
  if(data) {
    console.log(`✅ The ${name} has been created Successfuly ! ✅`, data)
  } else {
    console.log(`❌❌❌ The ${name} has not been recorded ! ❌❌❌`, data)
  }
}

const loadMocksOthers = async(AppDataSource, name, fieldOne, fieldTwo, mockData) => {
  for(let item of mockData) {
    await AppDataSource.query(`INSERT INTO ${name} (${fieldOne}, ${fieldTwo}) VALUES (${item[fieldOne]}, ${item[fieldTwo]})`);
  }
  const data = await AppDataSource.query(`SELECT * FROM ${name}`)
  if(data) {
    console.log(`✅ The ${name} has been created Successfuly ! ✅`, data)
  } else {
    console.log(`❌❌❌ The ${name} has not been recorded ! ❌❌❌`, data)
  }
}

(async() => {
  // we create an instance of AppDataSource and connect to Mysql
  const AppDataSource = new DataSource({
    ...mysqlOptions
  });
  // we initialize
  await AppDataSource.initialize()
  .then(async() => {
    console.log('AppDataSource has been initalized');
    await cleanDatabase(AppDataSource, 'report-shift')
    .then(async() => {
      await AppDataSource.synchronize();
      console.log('AppDataSource has been synchronized');
      // load mockData
      for (let item of allMocks) {
        console.log('xxxxxxxxxxxxxxxxxxxxx  ' + item.name + ' xxxxxxxxxxxxxxxxxxxxx')
        await loadMocks(AppDataSource, item.mockData, item.entity, item.name);
      }
      // load others data
      // for(let item of allMocksOthers) {
      //   // we load each mockOthers
      //   console.log('xxxxxxxxxxxxxxxxxxxxx  ' + item.name + ' xxxxxxxxxxxxxxxxxxxxx')
      //   await loadMocksOthers(AppDataSource, item.name, item.fieldOne, item.fieldTwo, item.mockData);
      // }
    });
  })
  .catch((error) => console.log(error));
})();

