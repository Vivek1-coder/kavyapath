'use client'

import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from 'next-auth/react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form";
import * as z from 'zod';
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";


export default function SignInForm(){
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver:zodResolver(signInSchema),
        defaultValues:{
            identifier:'',
            password:'',
        },
    });


  
    const onSubmit = async(data: z.infer<typeof signInSchema>) => {
      setIsSubmitting(true);
        const result = await signIn('credentials',{
            redirect:false,
            identifier: data.identifier,
      password: data.password,
        });

        if (result?.error) {
            if (result.error === 'CredentialsSignin') {
              toast('Incorrect username or password');
            } else {
              toast("Error");
            }
          }
      
          if (result?.url) {
            router.replace('/dashboard');
          }
          setIsSubmitting(false);
        };
        
      
      
        return (
            <div className="login-background  absolute flex h-full w-full justify-between">
              <p className="background-text">शब्दों का संगम, भावनाओं का मंच।</p>
              <div className="login-box">
                <div className="text-center">
                <Link href={`/`}>
          <ArrowLeft className="text-white hover:scale-125"/>
          </Link>
                  <p className="text-lg">आपका पुनः हार्दिक स्वागत है!</p>
                  <h1 className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-pink-500 text-4xl font-extrabold lg:text-5xl mb-3">
                  काव्य पथ
                  </h1>
                  <p className="mb-4">Sign in to your exciting journey</p>
                </div>
                <Form {...form}>
                <div className="login-icon h-fit">KP</div>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      name="identifier"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <Input {...field} />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="password"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <Input type="password" {...field} />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button className='login-button' type="submit" disabled={isSubmitting}>{isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Sign In"
              )}</Button>
                  </form>
                  </Form>
        <div className="flex items-center justify-center my-4">
          <hr className="w-1/3 border-t border-gray-300" />
          <span className="mx-2 text-gray-400">or</span>
          <hr className="w-1/3 border-t border-gray-300" />
        </div>
        <div className="text-center mt-4">
          <p>
            Not a member yet?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
          <div className="flex items-center justify-center my-4">
          <hr className="w-1/3 border-t border-gray-300" />
          <span className="mx-2 text-gray-400">or</span>
          <hr className="w-1/3 border-t border-gray-300" />
        </div>
          <p>
          Forgot Password?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Click here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}