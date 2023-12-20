import { Model } from "sequelize";
import db from "../models";
import { Leave } from "../entities/interfaces/leave.interface";
import {
  LeaveCreateRequest,
  LeaveUpdateRequest,
} from "../entities/requests/leave.request";

export class LeaveDao {
  constructor() {};

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
    const data = {
      userId : createRequest.userId,
      leaveType: createRequest.leaveType,
      startDate: createRequest.startDate,
      days: createRequest.days,
    };

    const models: Model = await db.Leave.create(data);
    console.log("created result => ", models);

    return models.get();
  }

  async updateLeave(updateRequest: LeaveUpdateRequest,id:string): Promise<Leave[]> {
    const data = updateRequest;
    const leaveId = id;
    const models: any = await db.Leave.update(data,{
        where:{
            id:leaveId
        },
    });
    console.log("updated result => ", models);

    return [models[0]];
  }

    async deleteLeave(id:string):Promise<Leave[]>{
        const leaveId = id;
        const models: any = await db.Leave.destroy({
            where:{
                id:leaveId
            }
        });
        console.log("deleted result => ",models);

        return models;
    }

  private convertToEntity(model: Model): Leave {
    const result = model.get({ plain: true });
    return result;
  }
}
