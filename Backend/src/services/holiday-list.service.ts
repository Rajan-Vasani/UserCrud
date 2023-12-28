import { HolidayList } from "../entities/interfaces/holiday-list.interface";
import { HolidayListDao } from "../dao/holiday-list.dao";

export class HolidayListService {
    private readonly holidayListDao: HolidayListDao

    constructor(){
        this.holidayListDao = new HolidayListDao();
    }

    async setHolidayList():Promise<HolidayList[]>{
        return await this.holidayListDao.setHolidayList();
    }

    async fetchHolidayList():Promise<HolidayList[]>{
        return await this.holidayListDao.fetchHolidayList();
    }
}