import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useVendorPackageStore } from "../store/useVendorPackageStore";
import { useVendorStore } from "../store/useVendorStore";
import { ImageUpload } from "../vendor-components/ImageUpload";

const formSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    type: z.enum(["at-salon", "at-home", "spa"]),
    gender: z.enum(["male", "female", "unisex"]),
    price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Price must be a positive number",
    }),
    services: z.array(z.string()).min(2, "Select at least 2 services"),
    image: z.string().min(1, "Package image is required"),
});

export function CreatePackage() {
    const navigate = useNavigate();
    const { createPackage, fetchVendorServices, vendorServices, loading } = useVendorPackageStore();
    const { vendorType } = useVendorStore(); // Need to import useVendorStore
    const [submitting, setSubmitting] = useState(false);

    const isSpaOwner = vendorType === "spa";

    useEffect(() => {
        fetchVendorServices();
    }, [fetchVendorServices]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            type: isSpaOwner ? "spa" : "at-salon",
            gender: "unisex",
            price: "",
            services: [],
            image: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setSubmitting(true);
        try {
            const success = await createPackage({
                ...values,
                price: Number(values.price),
            });

            if (success) {
                toast.success("Package created successfully");
                navigate("/vendor/packages");
            }
        } catch (error) {
            toast.error("Failed to create package");
        } finally {
            setSubmitting(false);
        }
    };

    const handleImageChange = (url: string | string[]) => {
        if (typeof url === "string") {
            form.setValue("image", url);
        }
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border p-4">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(-1)}
                        className="rounded-full"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="text-lg font-bold">Create New Package</h1>
                </div>
            </div>

            <div className="p-4 max-w-2xl mx-auto space-y-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                        {/* Image Upload */}
                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Package Image</FormLabel>
                                    <FormControl>
                                        <div className="w-full aspect-video rounded-xl overflow-hidden border-2 border-dashed border-border flex items-center justify-center bg-card">
                                            <ImageUpload
                                                value={field.value}
                                                onChange={handleImageChange}
                                                label="Upload Package Image"
                                                disabled={submitting}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Package Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Bridal Glow Package" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price (₹)</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="4999" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {!isSpaOwner && (
                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Service Type</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="at-salon">At Salon</SelectItem>
                                                    <SelectItem value="at-home">At Home</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            <FormField
                                control={form.control}
                                name="gender"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Gender</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select gender" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="male">Male</SelectItem>
                                                <SelectItem value="female">Female</SelectItem>
                                                <SelectItem value="unisex">Unisex</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Describe what's included in this package..."
                                            className="min-h-[100px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Services Selection */}
                        <FormField
                            control={form.control}
                            name="services"
                            render={() => (
                                <FormItem>
                                    <FormLabel className="flex justify-between">
                                        <span>Select Services (Min 2)</span>
                                        <span className="text-xs text-muted-foreground">{form.watch("services").length} selected</span>
                                    </FormLabel>
                                    <div className="border border-border rounded-xl p-4 max-h-[300px] overflow-y-auto space-y-3 bg-card">
                                        {loading ? (
                                            <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>
                                        ) : vendorServices.length === 0 ? (
                                            <p className="text-center text-muted-foreground text-sm">No services found. Create services first.</p>
                                        ) : (
                                            vendorServices.map((service) => (
                                                <FormField
                                                    key={service._id}
                                                    control={form.control}
                                                    name="services"
                                                    render={({ field }) => {
                                                        return (
                                                            <FormItem
                                                                key={service._id}
                                                                className="flex flex-row items-start space-x-3 space-y-0"
                                                            >
                                                                <FormControl>
                                                                    <Checkbox
                                                                        checked={field.value?.includes(service._id)}
                                                                        onCheckedChange={(checked) => {
                                                                            return checked
                                                                                ? field.onChange([...field.value, service._id])
                                                                                : field.onChange(
                                                                                    field.value?.filter(
                                                                                        (value) => value !== service._id
                                                                                    )
                                                                                )
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                                <div className="space-y-1 leading-none">
                                                                    <FormLabel className="font-normal">
                                                                        {service.name} <span className="text-muted-foreground ml-2">₹{service.price}</span>
                                                                    </FormLabel>
                                                                </div>
                                                            </FormItem>
                                                        )
                                                    }}
                                                />
                                            ))
                                        )}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Package
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}
