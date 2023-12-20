import {Leave} from "../entities/interfaces/leave.interface";
import {LeaveDao} from "../dao/leave.dao"
import {LeaveCreateRequest,LeaveUpdateRequest} from "../entities/requests/leave.request";

export class LeaveService{
    private readonly leaveDao : LeaveDao;

    constructor(){
        this.leaveDao = new LeaveDao();
    }

    async fetchLeaves():Promise<Leave[]>{
        return await this.leaveDao.fetchLeaves();
    }

    async fetchLeaveById(id:string):Promise<Leave[]>{
        return await this.leaveDao.fetchLeaveById(id);
    }

    async createLeave(createRequest:LeaveCreateRequest):Promise<Leave[]>{
        return await this.leaveDao.createLeave(createRequest);
    }

    async updateLeave(updateRequest:LeaveUpdateRequest,id:string):Promise<Leave[]>{
        return await this.leaveDao.updateLeave(updateRequest,id);
    }

    async deleteLeave(id:string):Promise<Leave[]>{
        return await this.leaveDao.deleteLeave(id);
    }
}