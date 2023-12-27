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

router.get("/carryLeave", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const leaveBalance: LeaveBalance[] = await leaveBalanceService.carryLeaves();
    res.json({ message: "leaves carry forward successfully"});
  } catch (error) {
    console.log(error);
    res.status(500).send("Error in carry forwarding leaves");
    next(error);
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

router.delete("/:id",async (req:Request, res:Response,next:NextFunction) => {
    const userId = req.params.id;
    try {
      const leave: LeaveBalance[] = await leaveBalanceService.deleteLeaveBalance(userId);
      console.log("delete => ", leave);
      if (leave[0]) {
        res.status(200).json("leave deleted successfully");
      } else {
        res.status(500).json("leave not deleted");
      }
    } catch (error: any) {
      console.error(error);
      res.status(500).json("Error in deleting leave: " + error.message);
      next(error);
    }
})

export default router;