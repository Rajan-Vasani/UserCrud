import { Model } from "sequelize";
import db from "../models";
import { LeaveBalance } from "../entities/interfaces/leave-balance.interface";
import {
  LeaveBalanceCreateRequest,
  LeaveBalanceUpdateRequest,
} from "../entities/requests/leave-balance.request";

export class LeaveBalanceDao {
  constructor() {}

  async fetchLeaveBalance(): Promise<LeaveBalance[]> {
    const models: Model[] = await db.LeaveBalance.findAll({});
    return models.map((model: Model) => this.convertToEntity(model));
  }

  async createLeaveBalance(createRequest:LeaveBalanceCreateRequest): Promise<LeaveBalance[]>{
    const data={
        userId:createRequest.userId,
        leaveType:createRequest.leaveType,
        balance:createRequest.balance
    };
    const models: Model = await db.LeaveBalance.create(data);
    console.log("created result => ", models);
    
    return models.get();
  }

//   async updateLeaveBalance(updateRequest:LeaveBalanceUpdateRequest):Promise<LeaveBalance[]>{
//   }

  private convertToEntity(model: Model): LeaveBalance {
    const result = model.get({ plain: true });
    return result;
  }
}
