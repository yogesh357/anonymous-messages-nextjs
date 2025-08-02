import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {

    await dbConnect()

    try {
        const { username, code } = await request.json()

        const decodedUsername = decodeURIComponent(username).trim();
        console.log(decodedUsername)
        const user = await UserModel.findOne({ username: decodedUsername })
        console.log("user from verify-code ==========", user)
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, {
                status: 404
            })
        }
        // Check if user is already verified
        if (user.isVerified) {
            return Response.json({
                success: false,
                message: "User is already verified"
            }, {
                status: 400
            });
        }
        const isCodeValid = user.verifyCode == code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true
            await user.save()

            return Response.json({
                success: true,
                message: "Account verified successfully"
            }, {
                status: 200
            })
        } else if (!isCodeNotExpired) {
            return Response.json({
                success: false,
                message: "Verification code expired ,please signup again to get new verification code"
            }, {
                status: 400
            })
        } else {
            return Response.json({
                success: false,
                message: "Incorrect verification code"
            }, {
                status: 400
            })
        }
    } catch (error) {
        console.log("Error Verifying user", error)
        return Response.json({
            success: false,
            message: "Error Verifying user"
        }, {
            status: 500
        })
    }

}

// Temporary debug route - add this to your API file
export async function GET() {
    await dbConnect();
    const allUsers = await UserModel.find({});
    console.log("All users in DB:", allUsers.map(u => u.username));

    return Response.json({
        users: allUsers.map(u => ({ username: u.username, email: u.email }))
    });
}