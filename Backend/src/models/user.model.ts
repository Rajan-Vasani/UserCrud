import {Model} from "sequelize";
import User from "../entities/interfaces/user.interface";
import UserRole from "../entities/enums/user.enum";

interface UserInterface extends Omit<User,'createdAt'|'updatedAt'>{};

module.exports = (sequelize:any,DataTypes:any) => {
    class User extends Model<UserInterface> implements UserInterface{
        public id !: string;
        public firstName !: string;
        public lastName !: string;
        public email !: string;
        public role !: UserRole;
    }

    User.init({
        id:{
            type:DataTypes.UUID,
            defaultValue:DataTypes.UUIDV4,
            primaryKey:true
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role:{
            type:DataTypes.STRING,
            allowNull:false
        }
    },{
        sequelize,
        modelName: 'User',
        tableName: 'users',
    })

    return User;
}

export default User;