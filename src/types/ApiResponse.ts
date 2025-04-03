import { User } from "@/model/User.model";

export interface ApiResponse{
    success: boolean;
    message: string;
    adminName?:string;
    user?:Array<User>;
}      