import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET() {
  try {
    await dbConnect();
    // const session = await getServerSession(authOptions);

    // if (!session?.user) {
    //   return Response.json(
    //     { success: false, message: "Not Authenticated" },
    //     { status: 401 }
    //   );
    // }

    const users = await UserModel.find({ isVerified: true });

    return Response.json(
      {
        success: true,
        users,
        message: "Users fetched successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return Response.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
