import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

import logo from "/dti-logo.png";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@radix-ui/react-label";

import { useSigninMutation } from "@/api/auth/authApiSlice";
import { useDispatch } from "react-redux";

import { setCredentials } from "@/api/auth/authSlice";

import { signOut } from "@/api/auth/authSlice";
import { clearBusinessList } from "@/api/business/businessSlice";
import { clearEventList } from "@/api/event/eventSlice";
import { clearUserList } from "@/api/user/userSlice";

import { signInSchema } from "@/zod/authSchema";
import { clearNotication } from "@/api/notification/notificationSlice";

const SignIn = () => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [signin, { isLoading }] = useSigninMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    try {
      const result = await signin(data).unwrap();

      dispatch(
        setCredentials({
          user: result.user,
          accessToken: result.accessToken,
        }),
      );

      if (result.user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (result.user.role === "monitor") {
        navigate("/monitor/events");
      } else if (
        result.user.role === "exhibitor" ||
        result.user.role === "user"
      ) {
        navigate("/sales");
      } else navigate("/registration");
    } catch (error: unknown) {
      if (error) {
        toast({
          variant: "destructive",
          title: (error as { data: { message: string } }).data.message,
          description: (error as { data: { error: string } }).data.error,
        });
      }
    }
  };

  // reset the storage when you visit sign in
  useEffect(() => {
    // Clear relevant data
    dispatch(signOut());
    dispatch(clearBusinessList());
    dispatch(clearEventList());
    dispatch(clearUserList());
    dispatch(clearNotication());
  }, [dispatch]);

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <div className="flex items-center gap-2 mb-10">
        <div className="bg-white rounded-md">
          <img src={logo} className="h-10 p-1" />
        </div>
        <div>
          <p className="text-3xl font-bold">TRADE FAIR MS</p>
        </div>
      </div>
      <Card className="w-[300px] p-6">
        <div>
          <p className="text-3xl font-bold mb-6">Sign In</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="abc@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        {...field}
                      />

                      <button
                        type="button"
                        className="absolute right-2 top-2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <Eye size={16} />
                        ) : (
                          <EyeOff size={16} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end pb-2">
              <Label htmlFor="forgotPass">
                <a
                  className="mx-2 text-blue-500 text-sm"
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot password
                </a>
              </Label>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Loading..." : "Sign In"}
            </Button>
          </form>
        </Form>

        <div className="my-4">
          <Label htmlFor="noAccount">
            Don't have an account?
            <a
              className="mx-2 text-blue-500"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </a>
          </Label>
        </div>
      </Card>
    </div>
  );
};

export default SignIn;
