"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const TabsContext = React.createContext<{
    value?: string
    onValueChange?: (value: string) => void
} | null>(null)

function Tabs({
    className,
    defaultValue,
    value,
    onValueChange,
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement> & {
    defaultValue?: string
    value?: string
    onValueChange?: (value: string) => void
}) {
    const [tabValue, setTabValue] = React.useState(value || defaultValue)

    const handleValueChange = (newValue: string) => {
        setTabValue(newValue)
        onValueChange?.(newValue)
    }

    return (
        <TabsContext.Provider value={{ value: tabValue, onValueChange: handleValueChange }}>
            <div
                data-slot="tabs"
                className={cn("flex flex-col gap-2", className)}
                {...props}
            >
                {children}
            </div>
        </TabsContext.Provider>
    )
}

function TabsList({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            data-slot="tabs-list"
            className={cn(
                "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground w-full",
                className
            )}
            {...props}
        />
    )
}

function TabsTrigger({
    className,
    value,
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }) {
    const context = React.useContext(TabsContext)
    const isActive = context?.value === value

    return (
        <button
            data-slot="tabs-trigger"
            type="button"
            data-state={isActive ? "active" : "inactive"}
            onClick={() => context?.onValueChange?.(value)}
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm w-full",
                className
            )}
            {...props}
        />
    )
}

function TabsContent({
    className,
    value,
    ...props
}: React.HTMLAttributes<HTMLDivElement> & { value: string }) {
    const context = React.useContext(TabsContext)
    const isActive = context?.value === value

    if (!isActive) return null

    return (
        <div
            data-slot="tabs-content"
            data-state={isActive ? "active" : "inactive"}
            className={cn("flex-1 outline-none", className)}
            {...props}
        />
    )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
