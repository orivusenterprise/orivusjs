import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority" // Wait, I need class-variance-authority and @radix-ui/react-slot for full shadcn?
// I don't want to overcomplicate if I don't have to. I'll stick to simple tailwind components for now to avoid installing 20 packages.
// Simplified Button without CVA if possible, or just install CVA. CVA is standard.

// Installing CVA and Slot just in case, or I can just use simple props.
// Let's use simple props to minimize deps, but CVA is cleaner.
// I'll install class-variance-authority and @radix-ui/react-slot.
