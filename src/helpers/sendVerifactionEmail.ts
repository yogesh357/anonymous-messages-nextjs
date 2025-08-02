// import { resend } from "@/lib/resend";
// import VerificationEmail from "../../emails/VerificationEmail";
// import { ApiResponse } from "@/types/ApiResponse";

// export async function sendVerificationEmail(
//     email: string,
//     username: string,
//     verifyCode: string
// ): Promise<ApiResponse> {
//     try {
//         await resend.emails.send({
//             from: 'onboarding@resend.dev',
//             to: email,
//             subject: "Mystry message | Verification code",
//             react: VerificationEmail({ username, otp: verifyCode })
//         })
//         console.log("data from send emaoldd", VerificationEmail({ username, otp: verifyCode }))
//         return { success: true, message: 'Verification email send successfully' }

//     } catch (emailError) {
//         console.log("Error sending verifaction email", emailError)
//         return { success: false, message: 'Failed to send verification email' }
//     }
// } 


/////////////

import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
import { transporter } from "@/lib/nodeMailer";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        transporter.sendMail({
            from: "dhakane020@gmail.com",
            to: email,
            subject: "Verification Code",
            text: `hello ${username}, your code is ${verifyCode}`,
            
        }, (err, info) => {
            if (err) {
                console.error("Email error:", err);
            } else {
                console.log("Email sent:", info.response);
            }
        });

        return { success: true, message: 'Verification email send successfully' }

    } catch (emailError) {
        console.log("Error sending verifaction email", emailError)
        return { success: false, message: 'Failed to send verification email' }
    }
} 