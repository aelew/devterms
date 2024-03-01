import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Skeleton } from '../ui/skeleton';

export function DefinitionCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-gradient text-3xl">
          <Skeleton className="h-5 w-72" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="space-y-2">
            <Skeleton className="h-5 w-72" />
            <Skeleton className="h-5 w-72" />
          </div>
          <div className="text-sm italic leading-4 text-muted-foreground">
            <Skeleton className="h-5 w-72" />
          </div>
        </div>
        <div className="flex items-center text-sm">
          <Skeleton className="h-5 w-48" />
        </div>
      </CardContent>
      <CardFooter className="justify-between gap-4 text-sm">
        <Skeleton className="h-5 w-32" />
        <div className="flex gap-4">
          <Skeleton className="h-5 w-14" />
          <Skeleton className="h-5 w-16" />
        </div>
      </CardFooter>
    </Card>
  );
}
