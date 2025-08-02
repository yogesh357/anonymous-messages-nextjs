import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";



export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401 });
    }

    try {
        const { acceptingMessages } = await request.json();
        // Correct the findByIdAndUpdate syntax
        const updatedUser = await UserModel.findByIdAndUpdate(
            user._id, // Just pass the ID directly
            { isAcceptingMessages: acceptingMessages },
            { new: true }
        );
        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "Failed to update user status"
            }, { status: 404 });
        }
        return Response.json({
            success: true,
            message: "Message acceptance status updated successfully",
            isAcceptingMessages: updatedUser.isAcceptingMessages
        }, { status: 200 });

    } catch (error) {
        console.error("Update error:", error);
        return Response.json({
            success: false,
            message: "Error updating message acceptance status"
        }, { status: 500 });
    }
}

export async function GET(request: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, {
            status: 401
        })
    }

    const userId = user._id
    try {
        const foundUser = await UserModel.findById({ _id: userId })
        if (!foundUser) {
            return Response.json({
                success: false,
                message: "User not found"
            }, {
                status: 404
            })
        }
        return Response.json({
            success: true,
            message: "User found",
            isAcceptingMessages: foundUser.isAcceptingMessages
        }, {
            status: 200
        })
    } catch (error) {
        console.log("Error while getting accecpting message status")
        return Response.json({
            success: false,
            message: "Error while getting accecpting message status"
        }, {
            status: 500
        })
    }
}