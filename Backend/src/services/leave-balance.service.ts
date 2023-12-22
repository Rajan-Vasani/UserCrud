import { LeaveBalance } from "../entities/interfaces/leave-balance.interface";
import { LeaveBalanceDao } from "../dao/leave-balance.dao";
import { LeaveBalanceCreateRequest,LeaveBalanceUpdateRequest } from "../entities/requests/leave-balance.request";
import { LeaveCreateRequest } from "../entities/requests/leave.request";

export class LeaveBalanceService{
    private readonly leaveBalanceDao : LeaveBalanceDao;

    constructor(){
        this.leaveBalanceDao = new LeaveBalanceDao();
    }

    async fetchLeaveBalance():Promise<LeaveBalance[]>{
        return await this.leaveBalanceDao.fetchLeaveBalance();
    }

    async createLeaveBalance(createRequest:LeaveBalanceCreateRequest):Promise<LeaveBalance[]>{
        return await this.leaveBalanceDao.createLeaveBalance(createRequest);
    }

    async deleteLeaveBalance(id:string):Promise<LeaveBalance[]>{
        return await this.leaveBalanceDao.deleteLeaveBalance(id);
    }
}