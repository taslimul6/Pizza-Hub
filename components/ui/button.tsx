import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

// PizzaHub buttons: pill shape, bold text, warm brand colors.
const buttonStyles = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-transparent bg-clip-padding font-bold whitespace-nowrap transition-colors outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // Tomato red - main call to action
        default: "bg-primary text-primary-foreground hover:bg-primary-600",
        // Dark outline that fills on hover
        outline:
          "border-2 border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background",
        // Basil green
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary-600",
        // Cheese gold (used on dark backgrounds)
        accent: "bg-accent text-accent-foreground hover:bg-white",
        // No background until hovered
        ghost: "hover:bg-muted hover:text-foreground aria-expanded:bg-muted",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:ring-destructive/20",
        link: "text-primary-600 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 text-base",
        xs: "h-7 px-3 text-xs",
        sm: "h-9 px-4 text-sm",
        lg: "h-13 px-7 text-lg",
        icon: "size-10",
        "icon-sm": "size-8",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// Use this on <Link> elements too. It merges conflicting classes
// (e.g. "border-transparent" vs "border-foreground") so variants and
// extra className always win as expected.
function buttonVariants(props?: Parameters<typeof buttonStyles>[0]) {
  return cn(buttonStyles(props))
}

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonStyles>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={(state) =>
        cn(
          buttonStyles({ variant, size }),
          typeof className === "function" ? className(state) : className
        )
      }
      {...props}
    />
  )
}

export { Button, buttonVariants }
