import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/model/User";
import { use } from "react";

export async function POST(request: Request) {
    dbConnect()
    const { username, content } = await request.json()

    try {
        const user = await UserModel.findOne({ username })
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, {
                status: 404
            })
        }

        // is user accepting the messages
        if (!user.isAcceptingMessages) {
            return Response.json({
                success: false,
                message: "User is not accepting the messages"
            }, {
                status: 403
            })
        }
        const newMessage = { content, createdAt: new Date() }
        user.messages.push(newMessage as Message)
        await user.save()

        return Response.json({
            success: true,
            message: "Message sent succesfully"
        }, {
            status: 200
        })
    } catch (error) {
        console.log("Error while sending message",error)
         return Response.json({
            success: false,
            message: "Error while sending message"
        }, {
            status: 500
        })
    }
}