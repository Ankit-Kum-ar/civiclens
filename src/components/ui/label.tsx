"use client"

import * as React from "react"
import { cn } from "cn"

export type LabelProps = React.ComponentProps<"label">;

function Label({ className, ...props }: LabelProps) {
  return (
    <label
      data-slot="label"
      className={cn(
        "text-sm font-medium leading-none text-foreground select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Label }
