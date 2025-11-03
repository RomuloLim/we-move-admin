import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    {
        variants: {
            variant: {
                // Primary button - brand solid
                primary:
                    "bg-brand-600 text-white shadow-sm hover:bg-brand-700 focus-visible:ring-brand-300 active:bg-brand-700",
                // Secondary button - gray outline
                secondary:
                    "border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 hover:text-gray-800 focus-visible:ring-brand-300 active:bg-gray-100",
                // Secondary color button - brand outline
                "secondary-color":
                    "border border-brand-300 bg-white text-brand-700 shadow-sm hover:bg-brand-50 hover:text-brand-800 focus-visible:ring-brand-300 active:bg-brand-50",
                // Tertiary button - gray ghost
                tertiary:
                    "text-gray-600 hover:bg-gray-50 hover:text-gray-700 focus-visible:ring-brand-300 active:bg-gray-100",
                // Tertiary color button - brand ghost
                "tertiary-color":
                    "text-brand-700 hover:bg-brand-50 hover:text-brand-800 focus-visible:ring-brand-300 active:bg-brand-50",
                // Quaternary button - link style
                quaternary:
                    "text-gray-600 underline-offset-4 hover:underline hover:text-gray-700 focus-visible:ring-brand-300",
                // Quaternary color button - brand link
                "quaternary-color":
                    "text-brand-700 underline-offset-4 hover:underline hover:text-brand-800 focus-visible:ring-brand-300",
                // Destructive variants
                destructive:
                    "bg-error-600 text-white shadow-sm hover:bg-error-700 focus-visible:ring-error-300 active:bg-error-700",
                "destructive-secondary":
                    "border border-error-700 text-error-700 shadow-sm hover:bg-error-700 hover:text-white focus-visible:ring-error-300 active:bg-error-50",
                "destructive-tertiary":
                    "text-error-700 hover:bg-error-50 hover:text-error-800 focus-visible:ring-error-300 active:bg-error-50",
                "destructive-quaternary":
                    "text-error-700 underline-offset-4 hover:underline hover:text-error-800 focus-visible:ring-error-300",
                // Disabled state
                disabled:
                    "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed",
            },
            size: {
                sm: "h-8 rounded-md px-3 text-sm font-semibold leading-5 has-[>svg]:px-2.5",
                md: "h-10 rounded-md px-4 text-sm font-semibold leading-5 has-[>svg]:px-3.5",
                lg: "h-11 rounded-md px-4.5 text-base font-semibold leading-6 has-[>svg]:px-4",
                xl: "h-12 rounded-md px-5 text-base font-semibold leading-6 has-[>svg]:px-4.5",
                "2xl": "h-14 rounded-md px-7 text-lg font-semibold leading-7 has-[>svg]:px-6",
                // Icon only sizes
                "icon-sm": "size-8 rounded-md",
                "icon-md": "size-10 rounded-md",
                "icon-lg": "size-11 rounded-md",
                "icon-xl": "size-12 rounded-md",
                "icon-2xl": "size-14 rounded-md",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "md",
        },
    }
)

function Button({
    className,
    variant,
    size,
    asChild = false,
    disabled,
    ...props
}: React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean
    }) {
    const Comp = asChild ? Slot : "button"

    // Use disabled variant when button is disabled
    const effectiveVariant = disabled ? "disabled" : variant

    return (
        <Comp
            data-slot="button"
            className={cn(buttonVariants({ variant: effectiveVariant, size, className }))}
            disabled={disabled}
            {...props}
        />
    )
}

export { Button, buttonVariants }
