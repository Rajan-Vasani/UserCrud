import {Leave} from "../entities/interfaces/leave.interface";
import {LeaveDao} from "../dao/leave.dao"
import {ChangeLeaveStatusRequest, PlannedLeaveCreateRequest,NationalLeaveCreateRequest,LeaveUpdateRequest} from "../entities/requests/leave.request";

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

    async createPlannedLeave(createRequest:PlannedLeaveCreateRequest):Promise<Leave[]>{
        return await this.leaveDao.createPlannedLeave(createRequest);
    }

    async createNationalLeave(createRequest:NationalLeaveCreateRequest):Promise<Leave[]>{
        return await this.leaveDao.createNationalLeave(createRequest);
    }

    async updateLeave(updateRequest:LeaveUpdateRequest,id:string):Promise<Leave[]>{
        return await this.leaveDao.updateLeave(updateRequest,id);
    }

    async deleteLeave(id:string):Promise<Leave[]>{
        return await this.leaveDao.deleteLeave(id);
    }

    async changeLeaveStatus(changeLeaveStatusRequest:ChangeLeaveStatusRequest,id:string):Promise<Leave[]>{
        return await this.leaveDao.changeLeaveStatus(changeLeaveStatusRequest,id)
    }
}