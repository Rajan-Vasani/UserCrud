import {Model} from "sequelize";
import  {HolidayList}  from "../entities/interfaces/holiday-list.interface";

interface HolidayListInterface extends Omit<HolidayList,"createdAt"|"updatedAt">{};

module.exports = (sequelize:any,DataTypes:any) => {
    class HolidayList extends Model<HolidayListInterface> implements HolidayListInterface{
        public id!: string;
        public name!: string;
        public date!: string;
    }

    HolidayList.init({
        id:{
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        date:{
            type: DataTypes.DATE,
            allowNull: false,
        }
    },{
        sequelize,
        modelName: "HolidayList",
        tableName: "holiday-list"
    });

    return HolidayList;
}