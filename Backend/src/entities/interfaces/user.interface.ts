import UserRole from "../enums/user.enum"
interface User{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    createdAt : string;
    updatedAt : string;
}

export default User;