import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useContentStore } from "../store/useContentStore";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { ReferralConfig } from "../store/useContentStore";

interface ReferralSettingsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ReferralSettingsModal({ open, onOpenChange }: ReferralSettingsModalProps) {
    const { referralConfig, updateReferralConfig } = useContentStore();
    const [config, setConfig] = useState<ReferralConfig>(referralConfig);

    useEffect(() => {
        if (open) {
            setConfig(referralConfig);
        }
    }, [open, referralConfig]);

    const handleSave = () => {
        updateReferralConfig(config);
        toast.success("Referral settings updated");
        onOpenChange(false);
    };

    const handleStepChange = (index: number, field: 'title' | 'description', value: string) => {
        const newSteps = [...config.steps];
        newSteps[index] = { ...newSteps[index], [field]: value };
        setConfig({ ...config, steps: newSteps });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Referral Program Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                    <div className="space-y-2">
                        <Label>Terms & Conditions Note</Label>
                        <Textarea
                            value={config.termsNote}
                            onChange={(e) => setConfig({ ...config, termsNote: e.target.value })}
                            rows={3}
                        />
                    </div>

                    <div className="space-y-4">
                        <Label className="text-base font-semibold">Referral Steps</Label>
                        {config.steps.map((step, index) => (
                            <div key={step.id} className="p-4 border rounded-lg space-y-3 bg-muted/10">
                                <Label className="text-sm font-medium text-muted-foreground">Step {index + 1}</Label>
                                <div className="space-y-2">
                                    <Label className="text-xs">Title</Label>
                                    <Input
                                        value={step.title}
                                        onChange={(e) => handleStepChange(index, 'title', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Description</Label>
                                    <Textarea
                                        value={step.description}
                                        onChange={(e) => handleStepChange(index, 'description', e.target.value)}
                                        rows={2}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button onClick={handleSave} className="!bg-primary !text-black hover:!bg-primary/90">Save Changes</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
