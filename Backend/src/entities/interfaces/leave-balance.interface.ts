import { LeaveType } from "../enums/leave.enum";

export interface LeaveBalance{
    userId: string;
    leaveType: LeaveType;
    balance: number;
    createdAt:string;
    updatedAt:string;
}