"use client";

import * as React from "react";
import Link from "next/link";
import { z } from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { AuthHeroBanner } from "@/components/auth/AuthHeroBanner";
import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const registerSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.string().trim().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  agreeTerms: z
    .boolean()
    .refine((val) => val === true, "You must agree to the Terms & Conditions"),
});

type RegisterFormData = z.infer<typeof registerSchema>;
type FormErrors = Partial<Record<keyof RegisterFormData, string>>;

export default function RegisterPage() {
  const [formData, setFormData] = React.useState<RegisterFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    agreeTerms: true,
  });

  const [errors, setErrors] = React.useState<FormErrors>({});
  const [showPassword, setShowPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof RegisterFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, agreeTerms: checked }));
    if (errors.agreeTerms) {
      setErrors((prev) => ({ ...prev, agreeTerms: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = registerSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: FormErrors = {};
      for (const issue of result.error.issues) {
        const fieldName = issue.path[0] as keyof RegisterFormData;
        if (!fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      // Simulation or NextAuth registration submission
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-full items-stretch">
      {/* 1. Left Showcase Banner */}
      <AuthHeroBanner
        quote="Empowering Citizens, Fixing Infrastructure"
        authorOrSubtitle="Join our smart civic network to report hazards and track verified municipal repairs."
      />

      {/* 2. Right Form Container */}
      <div className="flex flex-1 flex-col justify-center px-4 py-8 sm:px-8 md:px-12 lg:px-14">
        <div className="mx-auto w-full max-w-[440px]">
          {/* Header */}
          <div className="space-y-2 mb-8">
            <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-primary hover:underline underline-offset-4"
              >
                Log in
              </Link>
            </p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* First & Last Name Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="firstName" className="sr-only">
                  First name
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.firstName)}
                  className="h-11 rounded-xl bg-card border-border/80 text-foreground placeholder:text-muted-foreground/80 focus-visible:border-primary shadow-xs"
                />
                {errors.firstName && (
                  <p className="text-xs font-medium text-destructive mt-1">
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="lastName" className="sr-only">
                  Last name
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.lastName)}
                  className="h-11 rounded-xl bg-card border-border/80 text-foreground placeholder:text-muted-foreground/80 focus-visible:border-primary shadow-xs"
                />
                {errors.lastName && (
                  <p className="text-xs font-medium text-destructive mt-1">
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="sr-only">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.email)}
                className="h-11 rounded-xl bg-card border-border/80 text-foreground placeholder:text-muted-foreground/80 focus-visible:border-primary shadow-xs"
              />
              {errors.email && (
                <p className="text-xs font-medium text-destructive mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password with Eye Toggle */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="sr-only">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.password)}
                  className="h-11 rounded-xl bg-card border-border/80 pr-11 text-foreground placeholder:text-muted-foreground/80 focus-visible:border-primary shadow-xs"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs font-medium text-destructive mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Terms & Conditions Checkbox */}
            <div className="pt-1">
              <div className="flex items-start gap-2.5">
                <Checkbox
                  id="agreeTerms"
                  checked={formData.agreeTerms}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(checked === true)
                  }
                  className="mt-0.5 rounded-sm"
                />
                <Label
                  htmlFor="agreeTerms"
                  className="text-xs font-normal text-muted-foreground leading-snug cursor-pointer select-none"
                >
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-foreground hover:underline underline-offset-2 font-medium"
                  >
                    Terms & Conditions
                  </Link>
                </Label>
              </div>
              {errors.agreeTerms && (
                <p className="text-xs font-medium text-destructive mt-1">
                  {errors.agreeTerms}
                </p>
              )}
            </div>

            {/* Primary Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-sm transition-all shadow-md mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                "Create account"
              )}
            </Button>

            {/* Divider */}
            <div className="relative my-6 flex items-center justify-center">
              <div className="w-full border-t border-border" />
              <span className="absolute bg-card px-3 text-xs text-muted-foreground">
                Or register with
              </span>
            </div>

            {/* Social Buttons */}
            <SocialAuthButtons isLoading={isSubmitting} />
          </form>
        </div>
      </div>
    </div>
  );
}
