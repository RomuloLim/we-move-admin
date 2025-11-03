import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const inputVariants = cva(
    "flex w-full rounded-md border font-normal text-base leading-6 transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "border-gray-300 bg-white text-gray-900 focus-visible:ring-blue-600 focus-visible:border-blue-600",
                error: "border-red-300 bg-white text-gray-900 focus-visible:ring-red-600 focus-visible:border-red-600",
            },
            size: {
                sm: "h-8 px-3 py-1.5 text-sm",
                md: "h-10 px-3 py-2 text-sm",
                lg: "h-11 px-3.5 py-2.5 text-base",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "md",
        },
    }
)

export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> &
    VariantProps<typeof inputVariants> & {
        label?: string
        hint?: string
        error?: string
        leftIcon?: React.ReactNode
        rightIcon?: React.ReactNode
    }

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, variant, size, type, label, hint, error, leftIcon, rightIcon, disabled, ...props }, ref) => {
        const hasError = error || variant === "error"
        const inputVariant = hasError ? "error" : "default"

        return (
            <div className="w-full">
                {label && (
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {leftIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            {leftIcon}
                        </div>
                    )}
                    <input
                        type={type}
                        className={cn(
                            inputVariants({ variant: inputVariant, size, className }),
                            leftIcon && "pl-10",
                            rightIcon && "pr-10",
                            disabled && "bg-gray-50 text-gray-500 border-gray-200"
                        )}
                        ref={ref}
                        disabled={disabled}
                        {...props}
                    />
                    {rightIcon && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                            {rightIcon}
                        </div>
                    )}
                </div>
                {hint && !hasError && (
                    <p className="mt-1.5 text-xs text-gray-600">{hint}</p>
                )}
                {hasError && (
                    <p className="mt-1.5 text-xs text-red-600">{error}</p>
                )}
            </div>
        )
    }
)
Input.displayName = "Input"

export { inputVariants }
