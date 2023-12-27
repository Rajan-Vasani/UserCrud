import {Model} from "sequelize";
import {Leave} from "../entities/interfaces/leave.interface";
import { LeaveType,LeaveApprovalStatus } from "../entities/enums/leave.enum";

interface LeaveInterface extends Omit<Leave,"createdAt"|"updatedAt"|"isNewRecord">{};

module.exports = (sequelize:any,DataTypes:any) => {
    class Leave extends Model<LeaveInterface> implements LeaveInterface{
        public id!: string;
        public userId!: string;
        public leaveType!: LeaveType;
        public startDate!: string;
        public days!: number;
        public status!: LeaveApprovalStatus;
    }

    Leave.init({
        id:{
            type:DataTypes.UUID,
            defaultValue:DataTypes.UUIDV4,
            primaryKey:true
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        leaveType: {
            type: DataTypes.STRING,
            allowNull: false
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        days: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status:{
            type:DataTypes.STRING,
            defaultValue:"PENDING"
        }
    },{
        sequelize,
        modelName: 'Leave',
        tableName: 'leaves'
    });

    return Leave;
}