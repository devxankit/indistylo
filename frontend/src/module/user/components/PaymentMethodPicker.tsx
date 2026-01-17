import { CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

export type PaymentMethod = "salon" | "online" | "wallet";

interface PaymentMethodPickerProps {
  selected: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
}

const METHODS = [
  {
    id: "online" as PaymentMethod,
    title: "Online Payment",
    description: "UPI, Cards, Netbanking",
    icon: CreditCard,
  },
];

export function PaymentMethodPicker({
  selected,
  onSelect,
}: PaymentMethodPickerProps) {
  return (
    <div className="space-y-4">
      {METHODS.map((method) => {
        const Icon = method.icon;
        const isSelected = selected === method.id;

        return (
          <button
            key={method.id}
            onClick={() => onSelect(method.id)}
            className={cn(
              "w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left",
              isSelected
                ? "bg-yellow-400/10 border-yellow-400 shadow-sm"
                : "bg-card border-border hover:border-primary/50"
            )}>
            <div
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                isSelected
                  ? "bg-yellow-400 text-gray-900"
                  : "bg-muted text-muted-foreground"
              )}>
              <Icon className="w-6 h-6" />
            </div>

            <div className="flex-1">
              <h4
                className={cn(
                  "font-bold text-sm",
                  isSelected ? "text-foreground" : "text-foreground/80"
                )}>
                {method.title}
              </h4>
              <p className="text-xs text-muted-foreground">
                {method.description}
              </p>
            </div>

            <div
              className={cn(
                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                isSelected
                  ? "border-yellow-400 bg-yellow-400"
                  : "border-muted-foreground/30"
              )}>
              {isSelected && (
                <div className="w-2.5 h-2.5 rounded-full bg-gray-900" />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
