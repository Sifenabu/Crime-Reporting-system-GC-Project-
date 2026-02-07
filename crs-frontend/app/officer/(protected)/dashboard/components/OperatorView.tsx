import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// components/OperatorView.tsx
import { OfficerUser } from "@/lib/auth";

interface OperatorViewProps {
  reports: any[];
  user: OfficerUser; // Add this line
}
export default function OperatorView({ reports }: OperatorViewProps) {
  const incoming = reports.filter((r) => r.status === "NEW");

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dispatch Control</h1>

      {/* Operator Specific: Urgent Queue */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-orange-200 bg-orange-50/30">
          <CardHeader className="flex flex-row items-center gap-2">
            <div className="h-3 w-3 bg-orange-500 rounded-full animate-pulse" />
            <CardTitle>Incoming Reports Queue</CardTitle>
          </CardHeader>
          <CardContent>
            {/* List only NEW reports that need assignment */}
            {incoming.map((report) => (
              <div
                key={report.id}
                className="flex justify-between p-3 border-b"
              >
                <span>
                  {report.caseNumber} - {report.crimeType.name}
                </span>
                <Button size="sm">Assign Officer</Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dispatch Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">4.2 min</p>
            <p className="text-xs text-muted-foreground">
              Avg. Assignment Time
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
