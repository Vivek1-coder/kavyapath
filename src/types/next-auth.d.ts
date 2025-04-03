import 'next-auth'
import { DefaultSession } from 'next-auth';

declare module 'next-auth'{
    interface User{
        _id?:string;
        isVerified?:boolean;
        username?:string;
       
    }

    interface Session{
        user:{
            _id?:string;
            isVerified?:boolean;
            username?:string;
            image?:string;
           accessToken?:string;
        } & DefaultSession['user']
    }

}

declare module 'next-auth/jwt'{
    interface JWT{
        _id?:string;
        isVerified?:boolean;
        username?:string
        

    }
}