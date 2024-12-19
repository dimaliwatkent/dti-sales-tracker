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
import FileField from "../user/events/form-fields/FileField";

import { useSignupMutation } from "@/api/auth/authApiSlice";
import { useDispatch } from "react-redux";

import { setCredentials } from "@/api/auth/authSlice";

import { signOut } from "@/api/auth/authSlice";
import { clearBusinessList } from "@/api/business/businessSlice";
import { clearEventList } from "@/api/event/eventSlice";
import { clearUserList } from "@/api/user/userSlice";

import { signUpSchema } from "@/zod/authSchema";
import { clearNotication } from "@/api/notification/notificationSlice";

const SignUp = () => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      role: "newUser",
      businessName: "",
      dtiRegistrationNumber: "",
    },
  });

  const [signup, { isLoading }] = useSignupMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    if (data.password !== data.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Passwords do not match",
      });
      return;
    }
    try {
      const result = await signup(data).unwrap();

      dispatch(
        setCredentials({
          user: result.user,
          accessToken: result.accessToken,
        }),
      );

      if (result.user.role === "admin") {
        navigate("/admin/dashboard");
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
          <p className="text-3xl font-bold">EXPO TRACK</p>
        </div>
      </div>
      <Card className="w-[300px] p-6">
        <div>
          <p className="text-3xl font-bold mb-6">Create Account</p>
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Juan Dela Cruz" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input placeholder="+63" disabled className="w-16" />
                      <Input placeholder="9876543212" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="businessName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Sweet Treats" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FileField
              name="document"
              label="DTI Certificate"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
              form={form}
            />

            <FormField
              control={form.control}
              name="dtiRegistrationNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>DTI Registration Number</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input placeholder="" {...field} />
                    </div>
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
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        {...field}
                      />

                      <button
                        type="button"
                        className="absolute right-2 top-2"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
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
            <Button type="submit" disabled={isLoading} className="w-full my-2">
              {isLoading ? "Loading..." : "Sign Up"}
            </Button>
          </form>
        </Form>

        <div className="my-4">
          <Label htmlFor="noAccount">
            Already have an account?
            <a
              className="mx-2 text-blue-500"
              onClick={() => navigate("/signin")}
            >
              Sign In
            </a>
          </Label>
        </div>
      </Card>
    </div>
  );
};

export default SignUp;
