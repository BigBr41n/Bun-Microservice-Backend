export const generateOTP = (len : number)=>{
    const digits = "0123456789";
    let otp = "";
    for (let i = 0; i < len; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
}