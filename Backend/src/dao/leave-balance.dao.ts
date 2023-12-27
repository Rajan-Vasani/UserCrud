import { Model,Op } from "sequelize";
import db from "../models";
import { LeaveBalance } from "../entities/interfaces/leave-balance.interface";
import {
  LeaveBalanceCreateRequest,
  LeaveBalanceUpdateRequest,
} from "../entities/requests/leave-balance.request";
import { LeaveType } from "../entities/enums/leave.enum";
import { Leave } from "../entities/interfaces/leave.interface";

export class LeaveBalanceDao {
  constructor() {}

  async fetchLeaveBalance(): Promise<LeaveBalance[]> {
    const models: Model[] = await db.LeaveBalance.findAll({});
    return models.map((model: Model) => this.convertToEntity(model));
  }

  async carryLeaves():Promise<LeaveBalance[]>{
    try{
      const date = new Date();
      if(date.toLocaleDateString() === "27/12/2023"){
        const usersWithExcessPlannedLeave = await db.LeaveBalance.findAll({
          where:{
            leaveType : LeaveType.PLANNED_LEAVE,
            balance: {[Op.gt]:12}
          }
        });

        const updateLeaveBalance = usersWithExcessPlannedLeave.map(async (leaveBalance:Model & LeaveBalance) =>{
          const newBalance = Math.min(leaveBalance.balance,12);
          await leaveBalance.update({ balance: newBalance });


          // leaveBalance.balance = Math.min(leaveBalance.balance,12);
          // return leaveBalance.save();
        });

        await Promise.all(updateLeaveBalance);

        await db.LeaveBalance.update({ balance : 0},{
          where:{
            leaveType : LeaveType.NATIONAL_LEAVE,
          }
        });

        console.log("Leave balances updated for year-end.");    
      }
    } catch(err:any){
      console.log("Error updating leave balances for year-end", err);
      throw err.message;
    }
    return [];
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

  async deleteLeaveBalance(id:string):Promise<LeaveBalance[]>{
    const userId = id;
    const models: any = await db.Leave.destroy({
      where: {
        userId: userId,
      },
    });
    console.log("deleted result => ", models);

    return models;
  }

  private convertToEntity(model: Model): LeaveBalance {
    const result = model.get({ plain: true });
    return result;
  }
}
