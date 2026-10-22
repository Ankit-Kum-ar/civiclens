"use client";

import { Button } from "@/components/ui/button";

interface SocialAuthButtonsProps {
  isLoading?: boolean;
  onGoogleSignIn?: () => void;
  onAppleSignIn?: () => void;
  onGitHubSignIn?: () => void;
  showGitHub?: boolean;
}

export function SocialAuthButtons({
  isLoading = false,
  onGoogleSignIn,
  onAppleSignIn,
}: SocialAuthButtonsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 w-full">
      {/* Google Button with Official Colored SVG */}
      <Button
        type="button"
        variant="outline"
        disabled={isLoading}
        onClick={onGoogleSignIn}
        className="w-full h-11 rounded-xl border-border bg-card hover:bg-muted/40 font-medium text-foreground transition-all duration-150 gap-2.5 shadow-xs"
      >
        <svg
          className="h-4 w-4 shrink-0"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            fill="#EA4335"
          />
        </svg>
        <span className="text-sm">Google</span>
      </Button>

      {/* Apple Button with Official Inline SVG */}
      <Button
        type="button"
        variant="outline"
        disabled={isLoading}
        onClick={onAppleSignIn}
        className="w-full h-11 rounded-xl border-border bg-card hover:bg-muted/40 font-medium text-foreground transition-all duration-150 gap-2.5 shadow-xs"
      >
        <svg
          className="h-4 w-4 shrink-0 fill-current text-foreground"
          viewBox="0 0 170 170"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.6-7.7-11.71-13.98-5.55-8.48-9.98-18.06-13.3-28.74-3.32-10.68-4.98-21.03-4.98-31.06 0-14.16 3.58-25.86 10.74-35.09 7.16-9.23 16.09-13.93 26.79-14.11 4.58 0 9.8 1.18 15.66 3.53 5.86 2.36 9.87 3.59 12.03 3.7 2.17-.11 6.36-1.39 12.57-3.83 6.21-2.44 11.29-3.53 15.24-3.26 13.94.76 24.81 5.98 32.61 15.66-12.19 7.39-18.17 17.51-17.95 30.34.22 10.01 4.03 18.38 11.43 25.12 7.4 6.74 16.21 10.44 26.43 11.1-2.17 6.42-4.78 12.67-7.83 18.77zM119.22 33.04c0-7.39 2.66-14.35 7.99-20.88 5.33-6.53 11.96-10.77 19.89-12.72.33 1.09.49 2.29.49 3.6 0 7.39-2.77 14.35-8.32 20.88-5.54 6.53-12.34 10.71-20.4 12.54-.22-1.09-.33-2.18-.33-3.42z" />
        </svg>
        <span className="text-sm">Apple</span>
      </Button>
    </div>
  );
}

export default SocialAuthButtons;
