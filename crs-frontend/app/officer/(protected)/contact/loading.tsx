// app/officer/contact/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ContactLoading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <Skeleton className="h-10 w-80 mb-4" />
        <Skeleton className="h-6 w-96" />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-5 w-32" />
          </div>
          <Skeleton className="h-10 w-32 rounded-lg" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Skeleton className="h-12 w-full rounded-lg" />
            <div className="space-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-64" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                    <Skeleton className="h-9 w-24 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="mt-4 flex gap-3">
                    <Skeleton className="h-9 w-20" />
                    <Skeleton className="h-9 w-20" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
