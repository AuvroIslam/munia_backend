<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{
    //
    public function register(Request $request) {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $otp = rand(100000, 999999);
        $otpExpiresAt = now()->addMinutes(10);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'otp' => $otp,
            'otp_expires_at' => $otpExpiresAt,
        ]);

        Mail::raw("Your PDF pulse verification code is: $otp", function ($message) use ($user) {
            $message->to($user->email)->subject('Verify your email');
        });


        return response()->json([
            'status' => 'success',
            'message' => 'User registered successfully. Please check your email for the OTP',
        ], 201);

    }

    public function verifyOtp(Request $request) {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'User not found',

            ], 404);
        }

        if ($user->otp !== $request->otp || now()->gt($user->otp_expires_at)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid or expired OTP'
            ], 400);
        }
        $user->email_verified_at = now();
        $user->otp = null;
        $user->otp_expires_at = null;
        $user->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Email verified successfully'
        ], 200);

    }

    public function login(Request $request) {
        $validatedData = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string'
        ]);

        $user = User::where('email', $validatedData['email'])->first();

        if (!$user || !Hash::check($validatedData['password'], $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid credentials'
            ], 401);
        }


        if (!$user->email_verified_at) {
            return response()->json([
                'status' => 'error',
                'message' => 'Email not verified. Please verify your email first.'
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token
        ], 200);
    }

    public function logout(Request $request) {
        $request->user()->currentAccessToken()->delete();
        
        return response()->json([
            'status' => 'success',
            'message' => 'Logged out successfully'
        ], 200);
    }
}
