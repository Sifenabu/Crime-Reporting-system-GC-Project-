"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, Loader2 } from "lucide-react";
import { saveAuthData, isAuthenticated } from "@/lib/auth";
import { useEffect } from "react";

// Validation schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: "SUPER_ADMIN" | "ADMIN" | "OPERATOR" | "OFFICER";
  };
}

export default function OfficerLoginPage() {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(true);

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/officer/dashboard");
    } else {
      setIsRedirecting(false);
    }
  }, [router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }

      return response.json() as Promise<LoginResponse>;
    },
    // onSuccess: (data) => {
    // // Save token and user to localStorage
    // saveAuthData(data.token, data.user);

    //   // Show success toast
    //   toast.success(`Welcome back, ${data.user.fullName}!`);

    //   // Redirect to dashboard
    //   router.push("/officer/dashboard");
    // },
    onSuccess: (data) => {
      // 1. Save to localStorage (for the UI/Client state)
      saveAuthData(data.token, data.user);

      // 2. Save to Cookie (for the Middleware/Server state)
      // This is the "Key" that opens the door in the middleware
      document.cookie = `userRole=${data.user.role}; path=/; max-age=86400; SameSite=Lax`;

      toast.success(`Welcome back, ${data.user.fullName}!`);

      // Use window.location.href for the first redirect after login
      // to ensure the cookie is fully recognized by the server
      window.location.href = "/officer/dashboard";
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Login failed. Please check your credentials."
      );
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  // Show loading while checking auth
  if (isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900/10 to-cyan-500/10">
        <Loader2 className="h-8 w-8 animate-spin text-blue-900" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900/10 to-cyan-500/10 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-4 bg-blue-900/10 rounded-full mx-auto">
            <Shield className="h-12 w-12 text-blue-900" />
          </div>
          <CardTitle className="text-3xl font-bold">Officer Portal</CardTitle>
          <CardDescription className="text-base">
            Secure access for authorized Adama Police personnel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="officer@adama-police.gov"
                {...register("email")}
                disabled={loginMutation.isPending}
                className="h-11"
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register("password")}
                disabled={loginMutation.isPending}
                className="h-11"
              />
              {errors.password && (
                <p className="text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold bg-blue-900 hover:bg-blue-800"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Access Levels Info */}
          <div className="mt-6 text-center space-y-3 pt-6 border-t">
            <div className="p-4 bg-blue-50 rounded-lg space-y-2">
              <p className="text-sm font-semibold text-blue-900">
                Access Levels:
              </p>
              <div className="text-xs text-gray-600 space-y-1 text-left">
                <p>
                  <strong>Officer</strong> - Case management & reporting
                </p>
                <p>
                  <strong>Operator</strong> - Report management & oversight
                </p>
                <p>
                  <strong>Admin</strong> - Officer & system management
                </p>
                <p>
                  <strong>Super Admin</strong> - Full system access
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
