import express, { NextFunction, Router, Request, Response } from "express";
import { HolidayListService } from "../services/holiday-list.service";
import { HolidayList } from "../entities/interfaces/holiday-list.interface";

const router: Router = express.Router();
const holidaylistService: HolidayListService = new HolidayListService();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const holidaylist: HolidayList[] = await holidaylistService.setHolidayList();
    res.json({ message: "holiday list set successfully", data: holidaylist });
  } catch (error) {
    console.log(error);
    res.status(500).json({error});
    next(error);
  }
});

router.get("/holidays", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const holidaylist: HolidayList[] = await holidaylistService.fetchHolidayList();
    res.json({ message: "holiday list fetched successfully", data: holidaylist });
  } catch (error) {
    console.log(error);
    res.status(500).json({error});
    next(error);
  }
});

export default router;
