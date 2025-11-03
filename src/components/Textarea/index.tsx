import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const textareaVariants = cva(
    "flex min-h-[80px] w-full rounded-md border px-3 py-2 font-normal text-base leading-6 ring-offset-background placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 resize-none",
    {
        variants: {
            variant: {
                default: "border-gray-300 bg-white text-gray-900 focus-visible:ring-blue-600 focus-visible:border-blue-600",
                error: "border-red-300 bg-white text-gray-900 focus-visible:ring-red-600 focus-visible:border-red-600",
            },
            size: {
                sm: "min-h-[60px] px-2.5 py-1.5 text-sm",
                md: "min-h-[80px] px-3 py-2 text-sm",
                lg: "min-h-[100px] px-3.5 py-2.5 text-base",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "md",
        },
    }
)

export type TextareaProps = Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> &
    VariantProps<typeof textareaVariants> & {
        label?: string
        hint?: string
        error?: string
        maxLength?: number
        showCharCount?: boolean
    }

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({
        className,
        variant,
        size,
        label,
        hint,
        error,
        disabled,
        maxLength,
        showCharCount = false,
        value,
        ...props
    }, ref) => {
        const hasError = error || variant === "error"
        const textareaVariant = hasError ? "error" : "default"
        const currentLength = typeof value === 'string' ? value.length : 0

        return (
            <div className="w-full">
                {label && (
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <textarea
                        className={cn(
                            textareaVariants({ variant: textareaVariant, size, className }),
                            disabled && "bg-gray-50 text-gray-500 border-gray-200",
                            showCharCount && maxLength && "pb-8"
                        )}
                        ref={ref}
                        disabled={disabled}
                        maxLength={maxLength}
                        value={value}
                        {...props}
                    />
                    {showCharCount && maxLength && (
                        <div className="absolute bottom-2 right-3 text-xs text-gray-500">
                            {currentLength}/{maxLength}
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
Textarea.displayName = "Textarea"

export { textareaVariants }
