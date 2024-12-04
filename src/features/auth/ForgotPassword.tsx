import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

import logo from "/dti-logo.png";

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

import { setCredentials } from "@/api/auth/authSlice";

import { useForgotPasswordMutation } from "@/api/auth/authApiSlice";
import { useDispatch } from "react-redux";

import { forgotPasswordSchema } from "@/zod/authSchema";

const ForgotPassword = () => {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
    try {
      const result = await forgotPassword(data.email).unwrap();
      toast({
        title: "Success",
        description: result.message,
      });

      navigate("/password-reset");

      dispatch(
        setCredentials({
          user: { email: data.email },
        }),
      );
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
      <Card className="w-[300px] p-6">
        <div>
          <p className="text-3xl font-bold mb-6">Forgot Password</p>
          <p className="text-sm text-primary/60 mb-6">
            Enter your email address and we'll send you a password reset code.
          </p>
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

            <div className="pt-4">
              <Button type="submit" disabled={isLoading} className="w-full ">
                {isLoading ? "Loading..." : "Send Code"}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default ForgotPassword;
