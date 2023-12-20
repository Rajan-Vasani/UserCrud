import {Model} from "sequelize";
import { LeaveBalance } from "../entities/interfaces/leave-balance.interface";
import { LeaveType } from "../entities/enums/leave.enum";

interface LeaveBalanceInterface extends Omit<LeaveBalance,"createdAt"|"updatedAt">{};

module.exports = (sequelize:any,DataTypes:any) => {
    class LeaveBalance extends Model<LeaveBalanceInterface> implements LeaveBalanceInterface{
        public userId!: string;
        public leaveType!: LeaveType;
        public balance!: number;
    }

    LeaveBalance.init({
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            primaryKey:true
        },
        leaveType: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey:true
        },
        balance: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },{
        sequelize,
        modelName: 'LeaveBalance',
        tableName: 'leave-balances',
    });

    return LeaveBalance;
}