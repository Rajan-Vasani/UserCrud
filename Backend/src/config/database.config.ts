import { NextFunction,Response,Request } from "express";
import db from "../models"

export const databaseConnector = async (req: Request, res: Response,next:NextFunction) => {
    try {
        console.log("In databaseConnector");
        const result = await db.sequelize.connect();        
        next();
    } catch (error) {
        console.log(error);
    }
}