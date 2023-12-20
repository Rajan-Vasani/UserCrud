import { LeaveType,LeaveApprovalStatus } from "../enums/leave.enum";
import { IsString,IsNotEmpty,IsEnum, IsNumber} from "class-validator";
export class LeaveCreateRequest{
    @IsString()
    @IsNotEmpty()
    userId!:string;

    @IsEnum(LeaveType)
    @IsNotEmpty()
    leaveType!:LeaveType;

    @IsNumber()
    @IsNotEmpty()
    startDate!:number;

    @IsNumber()
    @IsNotEmpty()
    days!:number;
}

export class LeaveUpdateRequest{
    @IsEnum(LeaveType)
    @IsNotEmpty()
    leaveType!:LeaveType;

    @IsNumber()
    @IsNotEmpty()
    startDate!:number;

    @IsNumber()
    @IsNotEmpty()
    days!:number;
}