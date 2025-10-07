"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Loader2, Key } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { signIn } from "../lib/auth-client";
import HomeNavbar from "../(components)/home-navbar";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  
  return (
    <div className="bg-gradient-to-r from-[#6f2dbd] to-[#f72585] h-full">
      <HomeNavbar />
      <Card className="max-w-md mx-auto mt-50">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Sign In</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  value={email}
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                      href="#"
                      className="ml-auto inline-block text-sm underline"
                    >
                      Forgot your password?
                    </Link>
                </div>

                <Input
                  id="password"
                  type="password"
                  placeholder="password"
                  autoComplete="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    onClick={() => {
                      setRememberMe(!rememberMe);
                    }}
                  />
                  <Label htmlFor="remember">Remember me</Label>
                </div>

            

            <Button
                type="submit"
                className="w-full"
                disabled={loading}
                onClick={async () => {
                  await signIn.email(
                  {
                      email,
                      password
                  },
                  {
                    onRequest: (ctx) => {
                      setLoading(true);
                    },
                    onResponse: (ctx) => {
                      setLoading(false);
                    },
                    onError: (ctx) => {
											toast.error(ctx.error.message);
										},
										onSuccess: async () => {
											router.push("/dashboard");
										},
                  },
                  );
                }}
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <p> Login </p>
                )}
                </Button>

            

            
          </div>
        </CardContent>
        <CardFooter>
            <div className="flex justify-center w-full border-t py-4">
              <p className="text-center text-xs text-neutral-500">
              built with{" "}
                <Link
                  href="https://better-auth.com"
                  className="underline"
                  target="_blank"
                >
                  <span className="dark:text-white/70 cursor-pointer">
                    better-auth.
                  </span>
                </Link>
              </p>
            </div>
          </CardFooter>
      </Card>
    </div>
  );
}