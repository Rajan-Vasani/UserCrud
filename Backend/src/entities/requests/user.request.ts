import UserRole from "../enums/user.enum";
import "reflect-metadata"
import { IsString,IsNotEmpty,IsEmail,IsEnum} from "class-validator";
export class UserCreateRequest{
    @IsString()
    @IsNotEmpty()
    firstName!: string;

    @IsString()
    @IsNotEmpty()
    lastName !: string;

    @IsEmail()
    @IsNotEmpty()
    email!:string;

    @IsEnum(UserRole)
    @IsNotEmpty()
    role!:UserRole;
}
export class UserUpdateRequest{

    id!: string;
    @IsString()
    @IsNotEmpty()
    firstName!: string;

    @IsString()
    @IsNotEmpty()
    lastName !: string;

    @IsEmail()
    @IsNotEmpty()
    email!:string;

    @IsEnum(UserRole)
    @IsNotEmpty()
    role!:UserRole;
}