import express, { NextFunction, Router, Request, Response } from "express";
import { LeaveBalanceService } from "../services/leave-balance.service";
import { LeaveBalance } from "../entities/interfaces/leave-balance.interface";
import {
  LeaveBalanceCreateRequest,
  LeaveBalanceUpdateRequest,
} from "../entities/requests/leave-balance.request";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";

const router: Router = express.Router();
const leaveBalanceService:LeaveBalanceService = new LeaveBalanceService();

router.get("/",async(req:Request,res:Response,next:NextFunction) => {
    try{
        const leaveBalance:LeaveBalance[] = await leaveBalanceService.fetchLeaveBalance();
        res.json({message:"data fetched successfully",data:leaveBalance});
    } catch(error){
        console.log(error);
        res.status(500).send("Error fetching leave balance details");
    }
});

router.post("/",async(req:Request,res:Response,next:NextFunction) =>{
    try{
        const createRequest:LeaveBalanceCreateRequest = plainToClass(LeaveBalanceCreateRequest,req.body);

        const validationError = await validate(createRequest);
        if(validationError.length > 0){
            res.status(400).json({ errors: validationError });
            return;
        }
        const leaveBalance:LeaveBalance[] = await leaveBalanceService.createLeaveBalance(createRequest);

        res.json({message:"leave balance created successfully"});
    } catch(error){
        console.error(error);
        res.status(500).send("Error in creating leave balance");
    }
})

export default router;