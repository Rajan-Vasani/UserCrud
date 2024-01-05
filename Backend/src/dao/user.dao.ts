import User from "../entities/interfaces/user.interface";
import { UserCreateRequest,UserUpdateRequest } from "../entities/requests/user.request";
import db from "../models";
import { Model } from "sequelize";

export class UserDao {
  constructor() {}

  async fetchUsers(): Promise<User[]> {
    const models: Model[] = await db.User.findAll({});
    return models.map((model: Model) => this.convertToEntity(model));
  }

  async fetchUserById(id: string): Promise<User[]> {
    const models: Model = await db.User.findOne({
      where: {
        id: id,
      },
    });
    console.log("fetch by id : ",models);
    
    return models.get();
  }

  async createUser(createRequest:UserCreateRequest ): Promise<User[]> {
    const data ={
      firstName : createRequest.firstName,
      lastName : createRequest.lastName,
      email : createRequest.email,
      role : createRequest.role
    }
    const models: Model = await db.User.create(data);
    console.log("created result => ",models);
    
    return models.get();
  }


  async updateUser(updateRequest:UserUpdateRequest,id:string): Promise<User[]> {

    const data = updateRequest;
    const userid = id;
    const [affectedRows]:[number] = await db.User.update(data,{
      where:{id:userid}
    })
    // const models: any = await db.User.update(data,{
    //   where: {
    //     id: userid,
    //   },
    // });
    if(affectedRows > 0) {
      const updatedUser:User | null = await db.User.findOne({
        where:{id:userid}
      });
      if(updatedUser){
        return [updatedUser];
      } 
    }    
    // return [models[0]];
    return [];
  }
  
  async deleteUser(id:string): Promise<User[]> {
    const userid = id;
    const models: any = await db.User.destroy({
      where: {
        id: userid,
      },
    });
    console.log("deleted result => ",models);
    
    return models;
  }

  private convertToEntity(model: Model): User {
    const result = model.get({ plain: true });
    return result;
  }
}
