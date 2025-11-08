 
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
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
    console.log('Processing request for user:', user._id);

    try {
        // First try a simple find() query to verify user exists
        const userDoc = await UserModel.findById(user._id);

        if (!userDoc) {
            console.log('User document not found for ID:', user._id);
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }

        // Then try the aggregation
        const result = await UserModel.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(user._id)
                }
            },
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } },
            {
                $group: {
                    _id: '$_id',
                    messages: { $push: '$messages' }
                }
            }
        ]);

        console.log('Aggregation result count:', result.length);

        if (!result || result.length === 0) {
            return Response.json({
                success: true,
                messages: [] // Return empty array instead of error
            }, { status: 200 });
        }

        return Response.json({
            success: true,
            messages: result[0].messages
        }, { status: 200 });

    } catch (error) {
        console.error("Database error:", error);
        return Response.json({
            success: false,
            message: "Error while getting messages",
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}