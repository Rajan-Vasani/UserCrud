import { Model } from "sequelize";
import db from "../models";
import { Leave } from "../entities/interfaces/leave.interface";
import {
  PlannedLeaveCreateRequest,
  NationalLeaveCreateRequest,
  LeaveUpdateRequest,
  ChangeLeaveStatusRequest,
} from "../entities/requests/leave.request";

export class LeaveDao {
  constructor() {
    db.Leave.addHook("beforeCreate", async (leave: Leave) => {
      try {
        console.log("Inside beforeCreate hook => ");
        const leave_type = leave.leaveType;
        if (leave_type === "NATIONAL_LEAVE") {
          const { nhId, userId, leaveType } = leave;
          const nationalHoliday = await db.HolidayList.findOne({
            where: {
              id: nhId,
            },
          });
          const { name, date } = nationalHoliday;

          const leaveBalance = await db.LeaveBalance.findOne({
            where: {
              userId: userId,
              leaveType: leaveType,
            },
          });

          const currentdate = new Date(2023, 10, 1);

          const previouslyApplied = await db.Leave.findOne({
            where: {
              userId: userId,
              nhId: nhId,
            },
          });

          if (previouslyApplied != null) {
            throw new Error("You have already applied for this leave");
          } else if (currentdate.getTime() > date.getTime()) {
            throw new Error(`${name} holiday is not available`);
          } else if (!leaveBalance || leaveBalance.balance == 0) {
            throw new Error("Insufficient NATIONAL_LEAVE balance");
          }
        } else if (leave_type === "PLANNED_LEAVE") {
          const { userId, leaveType, days, startDate } = leave;
          const leaveBalance = await db.LeaveBalance.findOne({
            where: {
              userId: userId,
              leaveType: leaveType,
            },
          });
          const startdate = new Date(startDate);
          const currentdate = new Date();
          if (!leaveBalance || leaveBalance.balance < days) {
            throw new Error("Insufficient PLANNED_LEAVE balance");
          } else if(currentdate.getTime() > startdate.getTime()) {
            throw new Error("Date is out of range");
          }
        }
      } catch (error) {
        console.log("Error in beforeCreate hook", error);
        throw error;
      }
    });

    // ------------------------ Admin before approving leave --------------------
    db.Leave.addHook("beforeSave", async (leave: Leave, leaveId: any) => {
      if (leave.isNewRecord === false) {
        if (leave.status === "APPROVED") {
          console.log("IN APPROVED");

          try {
            console.log("Inside beforeSave hook =>");
            const { userId, status } = leave;
            const id = leaveId.where.id;

            const leaveData = await db.Leave.findOne({
              where: {
                id: id,
              },
            });
            const { leaveType, days } = leaveData;
            const leaveBalance = await db.LeaveBalance.findOne({
              where: {
                userId: userId,
                leaveType: leaveType,
              },
            });

            const { balance } = leaveBalance;
            console.log("leaveBalance =>", leaveBalance);

            const userData = await db.User.findOne({
              where: {
                id: userId,
              },
            });

            const { firstName, lastName } = userData;
            if (
              leave.leaveType === "PLANNED_LEAVE" &&
              (!leaveBalance || balance < days || days <= 0)
            ) {
              throw new Error(
                `Insufficient PLANNED_LEAVE balance of user ${firstName} ${lastName}`
              );
            } else if (
              leave.leaveType === "NATIONAL_LEAVE" &&
              (!leaveBalance || balance < days || days <= 0)
            ) {
              throw new Error(
                `Insufficient NATIONAL_LEAVE balance of user ${firstName} ${lastName}`
              );
            }
          } catch (error) {
            console.error("Error in beforeSave hook", error);
            throw error;
          }
        } else if (leave.status === "DECLINED") {
          leave.status === "DECLINED";
          console.log("leave status is DECLINED");
        }
      } else {
        console.log("CREATE METHOD");
      }
    });
    // -----------------------------------------------------------------
    db.Leave.addHook("afterUpdate", async (leave: Leave) => {
      try {
        console.log("Inside afterUpdate Hook => ");
        if (leave.status === "APPROVED") {
          const { userId, leaveType, days } = leave;
          const leaveBalance = await db.LeaveBalance.findOne({
            where: {
              userId: userId,
              leaveType: leaveType,
            },
          });

          if (leaveBalance) {
            if (leave.leaveType === "PLANNED_LEAVE") {
              db.LeaveBalance.leaveType = {
                PLANNED_LEAVE: (leaveBalance.balance -= leave.days),
              };
              // leaveBalance.balance -= leave.days;
            } else if (leave.leaveType === "NATIONAL_LEAVE") {
              db.LeaveBalance.leaveType = {
                NATIONAL_LEAVE: (leaveBalance.balance -= leave.days),
              };
            }
            await leaveBalance.save();
          }
        } else if (leave.status === "DECLINED") {
          console.log("leave status has been DECLINED");
        }
      } catch (error) {
        console.error("Error in afterUpdate hook:", error);
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
    return models.get();
  }

  async createPlannedLeave(createRequest: PlannedLeaveCreateRequest): Promise<Leave[]> {
    try {
      const models: Model = await db.Leave.create(createRequest);
      return models.get();
    } catch (err: any) {
      throw err.message;
    }
  }

  async createNationalLeave(createRequest: NationalLeaveCreateRequest): Promise<Leave[]> {
    try {
      const holidayDate = await db.HolidayList.findOne({
        where: {
          id: createRequest.nhId,
        },
      });
      const { date } = holidayDate;
      const data = {
        userId: createRequest.userId,
        nhId: createRequest.nhId,
        leaveType: createRequest.leaveType,
        startDate: date,
        days: 1,
      };
      const models: Model = await db.Leave.create(data);
      return models.get();
    } catch (err: any) {
      throw err.message;
    }
  }

  async updateLeave(updateRequest: LeaveUpdateRequest,id: string): Promise<Leave[]> {
    const data = updateRequest;
    const leaveId = id;
    const models: any = await db.Leave.update(data, {
      where: {
        id: leaveId,
      },
    });

    return [models[0]];
  }

  async deleteLeave(id: string): Promise<Leave[]> {
    const leaveId = id;
    const models: any = await db.Leave.destroy({
      where: {
        id: leaveId,
      },
    });

    return models;
  }

  async changeLeaveStatus(changeLeaveStatusRequest: ChangeLeaveStatusRequest,id: string): Promise<Leave[]> {
    const data = changeLeaveStatusRequest;
    const userId = changeLeaveStatusRequest;
    const leaveId = id;

    try {
      const models: any = await db.Leave.update(data, {
        where: {
          id: leaveId,
        },
        returning: true,
        individualHooks: true,
      });

      return [models[0]];
    } catch (error: any) {
      throw error.message;
    }
  }

  private convertToEntity(model: Model): Leave {
    const result = model.get({ plain: true });
    return result;
  }
}
