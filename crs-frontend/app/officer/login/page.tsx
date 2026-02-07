"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Shield, Loader2, AlertCircle, Clock } from "lucide-react";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
  };
}

export default function OfficerLoginPage() {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(true);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Check if already authenticated
  useEffect(() => {
    const token = localStorage.getItem("officerToken");
    const userStr = localStorage.getItem("officerUser");

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.role === "OPERATOR") {
          router.push("/operator/dashboard");
        } else if (user.role === "SUPER_ADMIN" || user.role === "ADMIN") {
          router.push("/admin/dashboard");
        } else {
          router.push("/officer/dashboard");
        }
      } catch {
        setIsRedirecting(false);
      }
    } else {
      setIsRedirecting(false);
    }
  }, [router]);

  // Countdown timer for rate limiting
  useEffect(() => {
    if (isRateLimited && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setIsRateLimited(false);
      setCountdown(60);
      setShowErrorModal(false);
    }
  }, [isRateLimited, countdown]);

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      // Handle rate limiting (429)
      if (response.status === 429) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error("RATE_LIMIT");
      }

      // Handle authentication errors (401)
      if (response.status === 401) {
        throw new Error("INVALID_CREDENTIALS");
      }

      // Handle other errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Login failed");
      }

      return response.json() as Promise<LoginResponse>;
    },
    onSuccess: (data) => {
      // Save to localStorage
      localStorage.setItem("officerToken", data.token);
      localStorage.setItem("officerAuth", "true");
      localStorage.setItem("officerUser", JSON.stringify(data.user));

      // Save to Cookie for middleware
      document.cookie = `userRole=${data.user.role}; path=/; max-age=86400; SameSite=Lax`;

      toast.success(`Welcome back, ${data.user.fullName}!`);

      // Redirect based on role
      if (data.user.role === "OPERATOR") {
        window.location.href = "/operator/dashboard";
      } else if (data.user.role === "SUPER_ADMIN" || data.user.role === "ADMIN") {
        window.location.href = "/admin/dashboard";
      } else {
        window.location.href = "/officer/dashboard";
      }
    },
    onError: (error: Error) => {
      if (error.message === "RATE_LIMIT") {
        setIsRateLimited(true);
        setCountdown(60);
        setErrorMessage(
          "Too many login attempts. Please wait 1 minute and try again."
        );
        setShowErrorModal(true);
      } else if (error.message === "INVALID_CREDENTIALS") {
        setErrorMessage("Incorrect email or password. Please try again.");
        setShowErrorModal(true);
      } else {
        setErrorMessage(error.message || "Login failed. Please try again.");
        setShowErrorModal(true);
      }
    },
  });

  const onSubmit = (data: LoginFormData) => {
    if (isRateLimited) {
      toast.error(`Please wait ${countdown} seconds before trying again`);
      return;
    }
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
                placeholder="officer@adama.et"
                {...register("email")}
                disabled={loginMutation.isPending || isRateLimited}
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
                disabled={loginMutation.isPending || isRateLimited}
              />
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Rate Limit Warning */}
            {isRateLimited && (
              <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-md">
                <Clock className="w-4 h-4 text-orange-600" />
                <p className="text-sm text-orange-800">
                  Please wait <strong>{countdown}s</strong> before trying again
                </p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending || isRateLimited}
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : isRateLimited ? (
                `Wait ${countdown}s`
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Error Modal */}
      <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className={`w-5 h-5 ${isRateLimited ? "text-orange-600" : "text-red-600"}`} />
              <DialogTitle>
                {isRateLimited ? "Too Many Attempts" : "Login Failed"}
              </DialogTitle>
            </div>
            <DialogDescription className="pt-2">
              {errorMessage}
            </DialogDescription>
            {isRateLimited && (
              <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-md">
                <p className="text-sm text-orange-800">
                  <strong>Security Notice:</strong> For your protection, we limit login attempts to prevent unauthorized access.
                </p>
                <p className="text-sm text-orange-800 mt-2">
                  Time remaining: <strong className="text-lg">{countdown}s</strong>
                </p>
              </div>
            )}
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => setShowErrorModal(false)}
              variant={isRateLimited ? "secondary" : "default"}
            >
              {isRateLimited ? `Wait ${countdown}s` : "Try Again"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
