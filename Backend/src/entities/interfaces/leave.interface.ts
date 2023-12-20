import { LeaveType, LeaveApprovalStatus } from "../enums/leave.enum";

export interface Leave {
  id: string;
  userId: string;
  leaveType: LeaveType;
  startDate: string;
  days: number;
  status: LeaveApprovalStatus;
  createdAt: string;
  updatedAt: string;
}
