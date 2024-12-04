import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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

import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/api/auth/authSlice";

import { useResetPasswordMutation } from "@/api/auth/authApiSlice";

import { resetPasswordSchema } from "@/zod/authSchema";

const ResetPassword = () => {
  const user = useSelector(selectCurrentUser);
  const email = user.email;

  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: email,
      pin: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const navigate = useNavigate();

  const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    if (data.password !== data.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Passwords do not match",
      });
      return;
    }
    try {
      const result = await resetPassword(data).unwrap();
      toast({
        title: "Success",
        description: result.message,
      });

      navigate("/password-reset/complete");
    } catch (error: unknown) {
      if (error) {
        toast({
          variant: "destructive",
          title: (error as { data: { message: string } }).data.message,
          description: (error as { data: { err: string } }).data.err,
        });
      }
    }
  };

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
      <Card className="w-[450px] p-6">
        <div>
          <p className="text-3xl font-bold mb-6">Reset Password</p>
          <p className="text-sm text-primary/60 mb-6"></p>
        </div>

        <div>
          <p className=" mb-6">
            Reset Code was sent to
            <span className="font-bold ml-2">{email}</span>
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pin Code</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
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
            <div className="pt-4">
              <Button type="submit" disabled={isLoading} className="w-full ">
                {isLoading ? "Loading..." : "Reset"}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default ResetPassword;
