import { FcGoogle} from "react-icons/fc";
import { FaGithub} from "react-icons/fa";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

import { DotSeperator } from "@/components/dot-seperator";
import {Card,CardContent,CardHeader,CardTitle} from "@/components/ui/card";
import {Form,FormControl,FormField,FormMessage,FormItem} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { loginSchema } from "../schemas";
import { useLogin } from "../api/use-login";

import Link from "next/link";


export const SignInCard = () => {

    const {mutate} = useLogin();

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues:{
            email: "",
            password: "",
        },
    });

    const onSubmit = (values: z.infer<typeof loginSchema>) => {
        mutate({json:values});
    };

    return (
        <Card className="w-full h-full md:w-[490px] border-none shadow-none">
            <CardHeader className="flex items-center justify-center text-center p-4">
                <CardTitle className="text-2xl">
                    Welcome Back!
                </CardTitle>
            </CardHeader>
            <div className="px-7">
                <DotSeperator />
            </div>
            <CardContent className="p-7">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
                        <FormField
                            name="email"
                            control={form.control}
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                        {...field}
                                        type="email"
                                        placeholder="Enter Email address"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="password"
                            control={form.control}
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                        {...field}
                                        type="password"
                                        placeholder="Enter Password"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button disabled={false} size="lg" className="w-full">
                            Login
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <div className="px-7">
                <DotSeperator />
            </div>
            <CardContent className="p-7 flex flex-col gap-y-4">
                <Button variant="secondary"
                        disabled={false}
                        size="lg"
                        className="w-full"
                    >
                        <FcGoogle className="mr-2 size-5" />
                    Login with Google
                </Button>
                <Button variant="secondary"
                        disabled={false}
                        size="lg"
                        className="w-full"
                    >
                        <FaGithub className="mr-2 size-5" />
                    Login with GitHub
                </Button>
            </CardContent>
            <div className="px-7">
                <DotSeperator />
            </div>
            <CardContent className=" p-7 flex items-center justify-center">
                <p>
                    Don&apos;t have an account?
                    <Link href="/sign-up">
                    <span className="text-blue-700">&nbsp;Sign Up</span>
                    </Link>
                    </p>
            </CardContent>
        </Card>
    );
};