import { Model } from "sequelize";
import db from "../models";
import { Leave } from "../entities/interfaces/leave.interface";
import { LeaveBalance } from "../entities/interfaces/leave-balance.interface";
import {
  LeaveCreateRequest,
  LeaveUpdateRequest,
  ChangeLeaveStatusRequest,
} from "../entities/requests/leave.request";

export class LeaveDao {
  constructor() {
    db.Leave.addHook('beforeValidate',async (leave:Leave) => {
      try{
        console.log("Inside beforeUpdate hook");
        const {id,userId,status} = leave;
        console.log("leave id:",id);
        console.log("User id:",userId);
        console.log("Status:",status);
        
        
      } catch (error){
        console.error("Error in beforeValidate hook",error);
      }
    })


    db.Leave.addHook('afterUpdate', async (leave: Leave) => {
      try {
        console.log("Inside afterUpdate Hook => ");
        if (leave.status === "APPROVED") {
          const { userId, leaveType, days } = leave;
          console.log("leave days => ",days);
          const leaveBalance = await db.LeaveBalance.findOne({
            where: {
              userId: userId,
              leaveType: leaveType,
            },
          });
          
          if(leaveBalance){
            if(leave.leaveType === "PLANNED_LEAVE"){
              db.LeaveBalance.leaveType = {
                  PLANNED_LEAVE: leaveBalance.balance -= leave.days,
              };  
              // leaveBalance.balance -= leave.days;
            } else if(leave.leaveType === "NATIONAL_LEAVE"){
              db.LeaveBalance.leaveType = {
                NATIONAL_LEAVE: leaveBalance.balance -= leave.days,
              }
            }
            await leaveBalance.save();
          }
        }
      } catch (error) {
        console.error('Error in afterUpdate hook:', error);
      }
    });



    db.Leave.addHook('beforeCreate',async (leave:Leave) => {
      try{
        console.log("Inside beforeCreate hook => ");
        const { userId, leaveType, days } = leave;
        const leaveBalance = await db.LeaveBalance.findOne({
          where:{
            userId : userId,
            leaveType : leaveType
          }
        });

        if(leave.leaveType === "PLANNED_LEAVE" && (!leaveBalance || leaveBalance.balance < days)){
          throw new Error ("Insufficient PLANNED_LEAVE balance");
        } else if(leave.leaveType === "NATIONAL_LEAVE" && (!leaveBalance || leaveBalance.balance < days)){
          throw new Error ("Insufficient NATIONAL_LEAVE balance");
        }

      } catch(error){
        console.log("Error in beforeCreate hook",error);
        throw error;
      }
    });

  }

  async fetchLeaves(): Promise<Leave[]> {
    const models: Model[] = await db.Leave.findAll({});
    return models.map((model: Model) => this.convertToEntity(model));
  }

  async fetchLeaveById(id: string): Promise<Leave[]> {
    const models: Model = await db.Leave.findOne({
      where: {
        id: id,
      },
    });
    console.log("fetch by id => ", models);

    return models.get();
  }

  async createLeave(createRequest: LeaveCreateRequest): Promise<Leave[]> {
    // const data = {
    //   userId: createRequest.userId,
    //   leaveType: createRequest.leaveType,
    //   startDate: createRequest.startDate,
    //   days: createRequest.days,
    // };
    try{
      const models: Model = await db.Leave.create(createRequest);
      console.log("created result => ", models);
      return models.get();
    } catch(err:any){
      throw err.message;
    }

  }

  async updateLeave(
    updateRequest: LeaveUpdateRequest,
    id: string
  ): Promise<Leave[]> {
    const data = updateRequest;
    const leaveId = id;
    const models: any = await db.Leave.update(data, {
      where: {
        id: leaveId,
      },
    });
    console.log("updated result => ", models);

    return [models[0]];
  }

  async deleteLeave(id: string): Promise<Leave[]> {
    const leaveId = id;
    const models: any = await db.Leave.destroy({
      where: {
        id: leaveId,
      },
    });
    console.log("deleted result => ", models);

    return models;
  }

  async changeLeaveStatus(changeLeaveStatusRequest: ChangeLeaveStatusRequest,id: string): Promise<Leave[]> {
    const data = changeLeaveStatusRequest;
    const userId = changeLeaveStatusRequest;
    const leaveId = id;
    
    try{
      const models: any = await db.Leave.update(data,{
        where:{
          id:leaveId,
        },returning :true,
        individualHooks:true,
      });

      console.log("updated result => ",models);
      return [models[0]];
    } catch(error){
      throw error;
    }

    



    // ------------------------- 4th Method ------------------------------------------
    // async function handleLeaveBalanceUpdate(leave: Leave) {
    //   if (leave.status === 'APPROVED') {
    //     const leaveBalance = await db.LeaveBalance.findOne({
    //       where: {
    //         userId: leave.userId,
    //         leaveType: leave.leaveType
    //       }
    //     });
    
    //     if (leaveBalance) {
    //       leaveBalance.balance -= leave.days;
    //       await leaveBalance.save();
    //     } else {
    //       // Handle case where leave balance doesn't exist (create it?)
    //     }
    //   }
    // }
    // console.log("updated result => ",models);

    // return [models[0]];



    // --------------------------------------------------------------------------------





    // -------------------------- 3rd Method -------------------------------------------
    // async function updateLeaveAndDeductBalance(id:string,data: any): Promise<void> {
    //   const leave = await db.Leave.findByPk(id);

    //   if (leave && leave.status === "APPROVED") {
    //     const { userId, leaveType, days } = leave;

    //     const leaveBalance = await db.LeaveBalance.findOne({
    //       where: {
    //         userId: userId,
    //         leaveType: leaveType,
    //       },
    //     });

    //     if (leaveBalance) {
    //       leaveBalance.balance -= days;
    //       await leaveBalance.save();
    //     }
    //   }

    //   await db.Leave.update(data, {
    //     where: {
    //       id: leaveId,
    //     },
    //   });
    // }
    // try {
    //   const models: any = await db.Leave.updateLeaveAndDeductBalance(id,data);
    //   console.log("updated result => ", models);
    //   return [models[0]];
    // } catch (error) {
    //   console.error("Error in changeLeaveStatus:", error);
    //   throw error;
    // }

    // ---------------------------------------------------------------------------------

    // ----------------------------- 2nd Method ---------------------------------------------
    // db.Leave.addHook('afterUpdate', 'updateLeaveBalance', async (leave: any) => {
    //   try {
    //     console.log("Inside addHook => ");
    //     if (leave.status === "APPROVED") {
    //       const { userId, leaveType, days } = leave;

    //       const leaveBalance = await db.LeaveBalance.findOne({
    //         where: {
    //           userId: userId,
    //           leaveType: leaveType,
    //         },
    //       });

    //       if (leaveBalance) {
    //         leaveBalance.balance -= days;
    //         await leaveBalance.save();
    //       }
    //     }
    //   } catch (error) {
    //     console.error('Error in afterUpdate hook:', error);
    //   }
    // });

    // ---------------------------------------------------------------------------------------

    // ----------------------- 1st  METHOD -----------------------------

    // db.Leave.afterUpdate(async (Leave:any,options:any) => {
    //   if(Leave.status === "APPROVED"){
    //     const leaveBalance = await db.LeaveBalance.findByPk(db.Leave.userId);
    //     const leavebalance = await db.LeaveBalance.findByPk({
    //       where:{
    //         userId:userId
    //       }
    //     });

    //     if(leaveBalance){
    //       const {PLANNED_LEAVE,NATIONAL_LEAVE} = db.LeaveBalance.leaveType;
    //       if(Leave.leaveType === "PLANNED_LEAVE"){
    //         db.LeaveBalance.leaveType = {
    //           PLANNED_LEAVE: leaveBalance.balance - Leave.days,
    //           NATIONAL_LEAVE
    //         };
    //       } else if(Leave.leaveType === "NATIONAL_LEAVE"){
    //         db.LeaveBalance.leaveType = {
    //             PLANNED_LEAVE,
    //             NATIONAL_LEAVE: leaveBalance.balance - Leave.days,
    //         }
    //       }
    //       await db.LeaveBalance.save();
    //     }
    //   }
    // })
    // -------------------------------------------------------------------------------------------
    // console.log("updated result => ",models);

    // return [models[0]];
  }

  private convertToEntity(model: Model): Leave {
    const result = model.get({ plain: true });
    return result;
  }
}
