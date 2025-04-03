'use client'

import { toast } from "sonner"
import { verifySchema } from '@/schemas/verifySchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import * as z  from 'zod'
import { useForm } from 'react-hook-form'
import axios, { AxiosError } from 'axios'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { ApiResponse } from '@/types/ApiResponse'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

const VerifyAccount = () => {
    const router = useRouter()
    const params = useParams<{username:string}>()
    

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver:zodResolver(verifySchema),
    })

    const onSubmit = async(data:z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post(`/api/verify-code`,{
                username:params.username,
                code:data.code
             })

            toast(response.data.message)

            router.replace('/sign-in')
        } catch (error) {
            console.error("Error in signUp of user",error)
            const axiosError = error as AxiosError<ApiResponse>;

            toast(axiosError.response?.data.message)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen  text-white">
          <div className="w-full max-w-md p-8 space-y-8 bg-slate-500 bg-opacity-40   rounded-lg shadow-md shadow-white">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                Verify Your Account
              </h1>
              <p className="mb-4">Enter the verification code sent to your email</p>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  name="code"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verification Code</FormLabel>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="bg-green-600 hover:bg-green-800">Verify</Button>
              </form>
            </Form>
          </div>
        </div>
      );
    }
export default VerifyAccount

