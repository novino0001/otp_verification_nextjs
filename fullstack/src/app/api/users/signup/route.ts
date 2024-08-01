import  connect  from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import {NextRequest , NextResponse } from 'next/server'
import bcryptjs from  'bcryptjs'
import { sendEmail } from "@/helpers/mailer";

connect();
export async function POST(request : NextRequest){
    try {
        const reqBody = await request.json();
        const {username , email , password } = reqBody
        console.log(reqBody);

        const user = await User.findOne({email})
        if(user){
            return NextResponse.json({error: 'Email already exists' },{status:400});
        }
        const hashedPassword = await bcryptjs.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });
        const savedUser = await newUser.save();
        console.log(savedUser);

        //send verification email

        await sendEmail({email,emailType: 'VERYFY' , userId:savedUser._id})
        return NextResponse.json({message: 'User created successfully', data: savedUser });




        }


    
    catch (error:any) {
        return NextResponse.json({ error: error.message },{status:500});
    }
}