import { Suspense } from "react";
import { auth } from "@/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/actions/auth";

async function SessionCard() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
        <Link
          href="/login"
          className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
        >
          Sign In
        </Link>
        <Link
          href="/register"
          className="inline-flex items-center justify-center rounded-xl border border-input bg-background px-5 py-2.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors shadow-xs"
        >
          Create an Account
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-muted/40 p-4 text-left space-y-2">
      <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
        Authenticated Session
      </p>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-foreground">{session.user.name}</p>
          <p className="text-xs text-muted-foreground">{session.user.email}</p>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          {(session.user as { role?: string }).role || "CITIZEN"}
        </span>
      </div>

      <div className="pt-3 flex flex-col gap-2.5">
        <Link
          href="/report"
          className="w-full inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
        >
          Report Street Hazard Now
        </Link>
        <form action={logoutAction}>
          <Button type="submit" variant="destructive" className="w-full rounded-xl">
            Sign Out
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-background text-foreground">
      <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-8 shadow-lg text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
          CivicLens Platform Live
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Welcome to CivicLens
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          Privacy-compliant citizen hazard reporting and rapid municipal triage.
        </p>

        <Suspense
          fallback={
            <div className="h-28 flex items-center justify-center text-sm text-muted-foreground">
              Loading session...
            </div>
          }
        >
          <SessionCard />
        </Suspense>
      </div>
    </main>
  );
}
