import { Model } from "sequelize";
import db from "../models";
import { HolidayList } from "../entities/interfaces/holiday-list.interface";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export class HolidayListDao {
  constructor() {}

  async setHolidayList(): Promise<HolidayList[]> {
    try {
      const date = new Date();
    //   if (date.toLocaleDateString() === "28/12/2023") {
        const key = process.env.GOOGLEAPI_KEY;
        const calendarId = process.env.CALENDAR_ID;
        const apiUrl = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${key}`;
        const response = await axios.get(apiUrl);
        if(response.status === 200) {
          const data = response.data;
          const items = data.items;
          const holidays = items.map((holiday:any) => ({name:holiday.summary, date: holiday.start.date}));
          const uniqueHoliday = holidays.filter((holiday:any) => holiday.date.startsWith('2023'));

        //   console.log("uniqueHoliday list: ", uniqueHoliday);
        //   console.log("uniqueHoliday list: ", uniqueHoliday.length);

          const models:Model[] = await db.HolidayList.bulkCreate(uniqueHoliday);

          return [];
        } else{
          console.log("no api data response",response.status);
        }
    //   }
    } catch (err: any) {
    //   console.log("Error in setting holiday list", err);
      throw err.message;
    }
    return [];
  };

  async fetchHolidayList(): Promise<HolidayList[]>{
    const models: Model[] = await db.HolidayList.findAll({});
    return models.map((model: Model) => this.convertToEntity(model));
  };

  
  private convertToEntity(model: Model): HolidayList {
    const result = model.get({ plain: true });
    return result;
  }
}
