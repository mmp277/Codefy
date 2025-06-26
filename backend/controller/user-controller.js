import {
  generateAccessTokenUtils,
  generateRefreshTokenUtils,
  otpGeneratorAndMailer,
  mailUtil,
} from "../utils.js";
import { User } from "../model/user.js";
import { OTPVerify } from "../model/otpverification.js";

export async function Signup(req, res) {
  const { username, email, password, techStack, language, codeforces, codechef, leetcode } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({
      error: true,
      message: "All required fields are not sent",
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      error: true,
      message: "Password must have at least 8 characters",
    });
  }

  const userExistenceCheck = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (userExistenceCheck) {
    return res.status(400).json({
      error: true,
      message: "User with same Email or Username already exists! Choose a different one.",
    });
  }

  const newUser = await User.create({
    username,
    email,
    password,
    techStack: techStack || " ",
    language: language || " ",
    codeforces: codeforces || " ",
    codechef: codechef || " ",
    leetcode: leetcode || " ",
    verfied: false,
    online: false,
  });

  if (!newUser) {
    return res.status(500).json({
      error: true,
      message: "New user not created due to server error",
    });
  }

  mailUtil(email, "Welcome to Codefy!!");
  return res.status(200).json({
    user: newUser,
    error_status: false,
    message: "Successfully created account. GO LOG IN!!!!",
  });
}

export async function OTPver(req, res) {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                error: true,
                message: "User not found"
            });
        }

        await OTPVerify.deleteMany({ expiresIn: { $lte: Date.now() } });

        const otp = await otpGeneratorAndMailer(user.email);
        if (!otp) {
            return res.status(500).json({
                error: true,
                message: "Failed to generate OTP"
            });
        }

        await OTPVerify.create({
            userId: user._id,
            otp: otp,
            expiresIn: Date.now() + 15 * 60 * 1000 // 15 minutes
        });

        return res.status(200).json({
            error: false,
            message: "OTP sent to your email"
        });

    } catch (error) {
        console.error('OTPver error:', error);
        return res.status(500).json({
            error: true,
            message: "Server error during OTP generation"
        });
    }
}

export async function OTPfinal(req, res) {
    try {
        const { otp } = req.body;
        const user = await User.findById(req.user._id);

        if (!otp || otp.length !== 6) {
            return res.status(400).json({
                error: true,
                message: "Invalid OTP format"
            });
        }

        const otpRecord = await OTPVerify.findOne({ userId: user._id });
        if (!otpRecord) {
            return res.status(400).json({
                error: true,
                message: "OTP not requested or expired"
            });
        }

        if (otpRecord.expiresIn <= Date.now()) {
            await otpRecord.deleteOne();
            return res.status(400).json({
                error: true,
                message: "OTP expired"
            });
        }

        const isMatch = await otpRecord.isOTPCorrect(otp);
        if (!isMatch) {
            return res.status(401).json({
                error: true,
                message: "Invalid OTP"
            });
        }

        user.verfied = true;
        await user.save({ validateBeforeSave: false });

        await otpRecord.deleteOne();

        return res.status(200).json({
            error: false,
            message: "Email verified successfully"
        });

    } catch (error) {
        console.error('OTPfinal error:', error);
        return res.status(500).json({
            error: true,
            message: "Server error during OTP verification"
        });
    }
}

export async function Login(req, res) {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({
        loggedInUser: null,
        error: true,
        message: "User does not exist! Provide a valid username.",
      });
    }

    const isMatch = await user.isPasswordCorrect(password);
    if (!isMatch) {
      mailUtil(user.email, "ALERT: Someone tried to log into your Codefy account with an invalid password.");
      return res.status(400).json({
        loggedInUser: null,
        error: true,
        message: "Incorrect password",
      });
    }

    const AccessToken = await generateAccessTokenUtils(user._id);
    const RefreshToken = await generateRefreshTokenUtils(user._id);

    if (!AccessToken || !RefreshToken) {
      return res.status(500).json({
        user: null,
        error: true,
        message: "Error generating tokens",
      });
    }

    user.online = true;
    await user.save({ validateBeforeSave: false });

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
      httpOnly: true,
    };

    return res
      .status(200)
      .cookie("AccessToken", AccessToken, options)
      .cookie("RefreshToken", RefreshToken, options)
      .json({
        error: false,
        loggedInUser,
        AccessToken,
        RefreshToken,
        message: "Successful login",
      });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Some server error occurred during login",
    });
  }
}

export async function ForgotPassword(req, res) {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({
        error: true,
        message: "Username does not exist",
      });
    }

    if (!user.verfied) {
      return res.status(401).json({
        error: true,
        message: "Email is not verified. Cannot reset password.",
      });
    }

    await OTPVerify.deleteMany({ expiresIn: { $lte: Date.now() } });

    const otp = await otpGeneratorAndMailer(user.email);
    if (!otp) {
      throw new Error("OTP generation failed");
    }

    const existingOTP = await OTPVerify.findOne({ userId: user._id });
    if (existingOTP) {
      return res.status(429).json({
        error: true,
        message: "Wait 15 minutes before requesting another OTP",
      });
    }

    await OTPVerify.create({
      userId: user._id,
      otp,
      expiresIn: Date.now() + 11 * 60 * 1000,
    });

    mailUtil(user.email, `Your OTP for Codefy password reset is ${otp}`);

    return res.status(200).json({
      error: false,
      message: "OTP sent to your registered email",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server error occurred during password reset request",
    });
  }
}

export async function ResetPassword(req, res) {
  try {
    const { username, newPassword, otp } = req.body;

    if (!username || !otp) {
      return res.status(400).json({
        error: true,
        message: "Username or OTP not provided",
      });
    }

    const user = await User.findOne({ username });

    const OTPCheck = await OTPVerify.findOne({ userId: user._id });
    if (!OTPCheck) {
      return res.status(400).json({
        error: true,
        message: "OTP request was not made!",
      });
    }

    if (OTPCheck.expiresIn <= Date.now()) {
      await OTPVerify.deleteOne({ userId: user._id });
      return res.status(400).json({
        error: true,
        message: "OTP request timed out",
      });
    }

    const isCorrect = await OTPCheck.isOTPCorrect(otp);
    if (!isCorrect) {
      await OTPVerify.deleteOne({ userId: user._id });
      return res.status(401).json({
        error: true,
        message: "OTP incorrect",
      });
    }

    await OTPVerify.deleteOne({ userId: user._id });
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    mailUtil(user.email, "Your Codefy password has been reset successfully");
    return res.status(200).json({
      error: false,
      message: "Password reset successful",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Server error occurred during password reset",
    });
  }
}

export async function Logout(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found",
      });
    }

    user.online = false;
    user.refreshToken = undefined;
    await user.save({ validateBeforeSave: false });

    const options = {
      httpOnly: true,
    };

    return res
      .status(200)
      .clearCookie("AccessToken", options)
      .clearCookie("RefreshToken", options)
      .json({
        error: false,
        message: "User logged out successfully",
      });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      error: true,
      message: "Server error occurred during logout",
    });
  }
}
