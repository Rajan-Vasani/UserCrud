import UserRole from "../enums/user.enum";
import "reflect-metadata"
import { IsString,IsNotEmpty,IsEmail,IsEnum, IsOptional} from "class-validator";
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
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    firstName!: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    lastName !: string;

    @IsOptional()
    @IsEmail()
    @IsNotEmpty()
    email!:string;

    @IsOptional()
    @IsEnum(UserRole)
    @IsNotEmpty()
    role!:UserRole;
}