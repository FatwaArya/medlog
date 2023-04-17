import * as React from "react"
import { VariantProps, cva } from "class-variance-authority"
import Link, { LinkProps } from "next/link"

import { cn } from "@/utils/cn"

const baseStyles = {
    solid:
        'group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2',
    outline:
        'group inline-flex ring-1 items-center justify-center rounded-full py-2 px-4 text-sm focus:outline-none',
}

const buttonVariants = cva(
    "active:scale-95 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:hover:bg-slate-800 dark:hover:text-slate-100 disabled:opacity-50 dark:focus:ring-slate-400 disabled:pointer-events-none dark:focus:ring-offset-slate-900 data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-slate-800",
    {
        variants: {
            variant: {
                default:
                    "bg-slate-900 text-white hover:bg-slate-700 dark:bg-slate-50 dark:text-slate-900",
                destructive:
                    "bg-red-500 text-white hover:bg-red-600 dark:hover:bg-red-600",
                success:
                    "bg-green-500 text-white hover:bg-green-600 dark:hover:bg-green-600",
                outline:
                    "bg-transparent border border-slate-200 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100",
                subtle:
                    "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-100",
                ghost:
                    "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-100 dark:hover:text-slate-100 data-[state=open]:bg-transparent dark:data-[state=open]:bg-transparent  ",
                link:
                    "inline-block rounded-lg py-1 px-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900",
                solid: baseStyles.solid,
                solidBlue:
                    `${baseStyles.solid} bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600`,
                solidWhite:
                    `${baseStyles.solid} focus-visible:outline-offset-2 bg-white text-slate-900 hover:bg-blue-50 active:bg-blue-200 active:text-slate-600 focus-visible:outline-white`,
                solidSlate:
                    `${baseStyles.solid} bg-slate-900 text-white hover:bg-slate-700 hover:text-slate-100 active:bg-slate-800 active:text-slate-300 focus-visible:outline-slate-900`,
                outlineWhite:
                    `${baseStyles.outline} ring-slate-700 text-white hover:ring-slate-500 active:ring-slate-700 active:text-slate-400 focus-visible:outline-white`,
                outlineSlate: `${baseStyles.outline} ring-slate-200 text-slate-700 hover:text-slate-900 hover:ring-slate-300 active:bg-slate-100 active:text-slate-600 focus-visible:outline-blue-600 focus-visible:ring-slate-300`,
                outlineBlue:
                    `${baseStyles.outline} ring-blue-600 text-blue-600 hover:text-white hover:ring-blue-500 hover:bg-blue-600 active:bg-blue-100 active:text-blue-700 focus-visible:outline-blue-600 focus-visible:ring-blue-500`,
            },
            size: {
                default: "h-10 py-2 px-4",
                sm: "h-8 px-2",
                lg: "h-11 px-8",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

//add href prop in interface if href is provided
export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    href?: string
}



const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, href, ...props }, ref) => {
        //return Link if href is provided
        if (href) {
            return (

                <Link href={href} legacyBehavior>
                    <button
                        ref={ref}
                        className={cn(buttonVariants({ variant, size }), className)}
                        {...props}
                    />
                    {/* {children}
                    </button> */}
                </Link>
            )
        }
        return (
            <button
                ref={ref}
                className={cn(
                    buttonVariants({ variant, size }),
                    className
                )}
                {...props}
            />

        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
