"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to console on client side
    console.error("Application render error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center p-4">
      <Card className="w-full max-w-md border-destructive/20 shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertTriangle className="size-6" />
          </div>
          <CardTitle className="text-xl">Something went wrong</CardTitle>
          <CardDescription>
            An unexpected error occurred while loading this page. Our team has been notified.
          </CardDescription>
        </CardHeader>

        {process.env.NODE_ENV !== "production" && error.message && (
          <CardContent>
            <div className="rounded-lg bg-muted p-3 font-mono text-xs text-muted-foreground break-words">
              {error.message}
            </div>
          </CardContent>
        )}

        <CardFooter className="flex justify-center pt-2">
          <Button
            onClick={() => reset()}
            variant="default"
            className="gap-2"
          >
            <RefreshCw className="size-4" />
            Try Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
