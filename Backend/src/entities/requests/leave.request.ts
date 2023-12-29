import { LeaveType,LeaveApprovalStatus } from "../enums/leave.enum";
import { IsString,IsNotEmpty,IsEnum, IsNumber} from "class-validator";
export class PlannedLeaveCreateRequest{
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

export class NationalLeaveCreateRequest{
    @IsString()
    @IsNotEmpty()
    userId!:string;

    @IsString()
    @IsNotEmpty()
    nhId !:string;

    @IsEnum(LeaveType)
    @IsNotEmpty()
    leaveType!:LeaveType;
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

export class ChangeLeaveStatusRequest{
    @IsString()
    @IsNotEmpty()
    userId!:string;

    @IsEnum(LeaveApprovalStatus)
    @IsNotEmpty()
    status!:LeaveApprovalStatus;
}