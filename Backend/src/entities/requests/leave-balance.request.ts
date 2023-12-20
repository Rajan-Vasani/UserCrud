import { LeaveType } from "../enums/leave.enum";
import { IsString,IsNotEmpty,IsNumber,IsEnum } from "class-validator";

export class LeaveBalanceCreateRequest{
    @IsString()
    @IsNotEmpty()
    userId!:string;

    @IsEnum(LeaveType)
    @IsNotEmpty()
    leaveType!:LeaveType;

    @IsNumber()
    @IsNotEmpty()
    balance!:number;
}

export class LeaveBalanceUpdateRequest{
    @IsString()
    @IsNotEmpty()
    userId!:string;

    @IsEnum(LeaveType)
    @IsNotEmpty()
    leaveType!:LeaveType;

    @IsNumber()
    @IsNotEmpty()
    balance!:number;
}