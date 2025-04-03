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
import { FcGoogle } from "react-icons/fc";
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
        
        const handleGoogleSignIn = async () => {
          setIsSubmitting(true);
          const result = await signIn('google', { redirect: false });
      
          if (result?.error) {
            toast(result.error);
          }
      
          if (result?.url) {
            router.replace('/dashboard');
          }
          setIsSubmitting(false);
        };
      
        return (
            <div className="flex justify-center items-center min-h-screen bg-black text-white">
              <div className="w-full max-w-md py-5 px-8 space-y-8 bg-transparent  rounded-lg sm:shadow-md sm:shadow-white">
                <div className="text-center">
                <Link href={`/`}>
          <ArrowLeft className="text-white hover:scale-125"/>
          </Link>
                  <p className="text-lg">Welcome Back to </p>
                  <h1 className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-pink-500 text-4xl font-extrabold lg:text-5xl mb-3">
                    Xam Buddy
                  </h1>
                  <p className="mb-4">Sign in to continue your preparation</p>
                </div>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      name="identifier"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email/Username</FormLabel>
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
                    <Button className='w-full bg-green-600 hover:bg-green-500 text-white bg-opacity-60' type="submit" disabled={isSubmitting}>{isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Sign Up"
              )}</Button>
                  </form>
                  </Form>
        <div className="flex items-center justify-center my-4">
          <hr className="w-1/3 border-t border-gray-300" />
          <span className="mx-2 text-gray-400">or</span>
          <hr className="w-1/3 border-t border-gray-300" />
        </div>
        <Button
          className="w-full flex items-center justify-center bg-white hover:bg-slate-300 text-gray-700 border border-gray-300"
          onClick={handleGoogleSignIn}
          disabled={isSubmitting}
        >
          <FcGoogle className="mr-2" size={20} />
          Sign In with Google
        </Button>
        <div className="text-center mt-4">
          <p>
            Not a member yet?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}