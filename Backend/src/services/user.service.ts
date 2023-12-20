import User from "../entities/interfaces/user.interface"
import { UserDao } from "../dao/user.dao"
import { UserCreateRequest, UserUpdateRequest } from "../entities/requests/user.request";
export class UserService{
    private readonly userDao : UserDao;

    constructor(){
        this.userDao = new UserDao();
    }

    async fetchUsers():Promise<User[]>{
        return await this.userDao.fetchUsers();
    }
    async fetchUserById(id:string):Promise<User[]>{
        return await this.userDao.fetchUserById(id);
    }

    async createUser(createRequest:UserCreateRequest):Promise<User[]>{
        return await this.userDao.createUser(createRequest);
    }

    async updateUser(updateRequest:UserUpdateRequest,id:string):Promise<User[]>{
        return await this.userDao.updateUser(updateRequest,id);
    }

    async deleteUser(id:string):Promise<User[]>{
        return await this.userDao.deleteUser(id);
    }
}