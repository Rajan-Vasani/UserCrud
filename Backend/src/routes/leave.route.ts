import express, { NextFunction, Router, Request, Response } from "express";
import { LeaveService } from "../services/leave.service";
import { Leave } from "../entities/interfaces/leave.interface";
import {
  LeaveCreateRequest,
  LeaveUpdateRequest,
  ChangeLeaveStatusRequest
} from "../entities/requests/leave.request";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";

const router: Router = express.Router();
const leaveService: LeaveService = new LeaveService();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const leave: Leave[] = await leaveService.fetchLeaves();
    res.json({ message: "data fetched successfully", data: leave });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching leave details");
    next(error);
  }
});

router.get("/:id", async (req: Request, res: Response, next) => {
  const leaveId = req.params.id;
  try {
    const leave: Leave[] = await leaveService.fetchLeaveById(leaveId);
    res.json({ message: "data fetched successfully by id", data: leave });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching leave details by id");
  }
});

router.post("/", async (req: Request, res: Response, next) => {
  try {
    const createRequest: LeaveCreateRequest = plainToClass(
      LeaveCreateRequest,
      req.body
    );
    const validationError = await validate(createRequest);
    if (validationError.length > 0) {
      res.status(400).json({ errors: validationError });
      return;
    }

    const leave: Leave[] = await leaveService.createLeave(createRequest);

    res.json({ message: "leave created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error in creating leave");
  }
});

router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const leaveId = req.params.id;
    const updateRequest: LeaveUpdateRequest = plainToClass(
      LeaveUpdateRequest,
      req.body
    );
    const validationError = await validate(updateRequest);

    if (validationError.length > 0) {
      res.status(400).json({ errors: validationError });
      return;
    }
    const leave: Leave[] = await leaveService.updateLeave(
      updateRequest,
      leaveId
    );
    console.log("user => ", leave);
    if (leave[0]) {
      res.json({ message: "leave updated successfully" });
    } else {
      res.json({ message: "leave not updated" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error in updating leave");
  }
});

router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const leaveId = req.params.id;
    try {
      const leave: Leave[] = await leaveService.deleteLeave(leaveId);
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
  }
);

router.put("/changestatus/:id",async (req: Request, res: Response, next: NextFunction) => {
  try{
      const leaveId = req.params.id;
      const changeLeaveStatusRequest: ChangeLeaveStatusRequest = plainToClass(ChangeLeaveStatusRequest,req.body);
      const validationError = await validate(changeLeaveStatusRequest);
      if(validationError.length > 0){
        res.status(400).json({errors:validationError});
        return;
      }

      const leave:Leave[] = await leaveService.changeLeaveStatus(changeLeaveStatusRequest,leaveId);
      if(leave[0]){
        res.json({message:"leave status updated succesfully"});
      }else{
        res.json({message:"leave status not updated"});
      }
    } catch(error){
      console.error(error);
      res.status(500).send("Error in updating the leave status");
    }
}
);
  
export default router;
