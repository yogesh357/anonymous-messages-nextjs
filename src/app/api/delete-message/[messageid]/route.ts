
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function DELETE(request: Request, { params }: { params: { messageid: string } }) {
    const messageId = params.messageid
    await dbConnect();

    const session = await getServerSession(authOptions);

    if (!session?.user) {
        console.log('Unauthorized access attempt');
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401 });
    }
    const user = session.user as User;

    try {
        const updatedRes = await UserModel.updateOne(
            { _id: user._id },
            { $pull: { messages: { _id: messageId } } }
        )
        if (updatedRes.modifiedCount == 0) {
            return Response.json({
                success: false,
                message: "Message not found or already deleted"
            }, { status: 404 });
        }
        return Response.json({
            success: true,
            message: "Message Deleted"
        }, { status: 200 });
    } catch (error) {
        console.log("error in deleting messages", error)
        return Response.json({
            success: false,
            message: "Error Deleting message"
        }, { status: 401 });
    }


}