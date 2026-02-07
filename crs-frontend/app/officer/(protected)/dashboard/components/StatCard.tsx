import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
  description?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  color,
  description,
}: StatCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div
            className={cn(
              "p-2 rounded-lg",
              color ? color : "bg-blue-100 text-blue-600"
            )}
          >
            <Icon className="h-6 w-6" />
          </div>
          <div className="text-2xl font-bold tracking-tight">{value}</div>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          {description && (
            <p className="text-xs text-muted-foreground mt-1 italic">
              {description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
