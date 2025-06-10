import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Music,
  Mail,
  Lock,
  User,
  ArrowLeft,
  Chrome,
  Guitar,
  Mic,
  Piano,
  Drum,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

const signupSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    instrument: z.string().optional(),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignupForm = z.infer<typeof signupSchema>;

const Signup = () => {
  const { signUp, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const from = location.state?.from?.pathname || "/dashboard";

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupForm) => {
    try {
      await signUp({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        instrument: data.instrument,
      });
      toast({
        title: "Welcome to Motion Connect! 🎵",
        description: "Your account has been created successfully.",
      });
      navigate(from, { replace: true });
    } catch (error) {
      toast({
        title: "Sign up failed",
        description:
          error instanceof Error ? error.message : "Failed to create account",
        variant: "destructive",
      });
    }
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle();
      toast({
        title: "Welcome to Motion Connect! 🎵",
        description: "Your account has been created successfully with Google.",
      });
      navigate(from, { replace: true });
    } catch (error) {
      toast({
        title: "Google sign up failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to sign up with Google",
        variant: "destructive",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const instruments = [
    { value: "guitar", label: "Guitar", icon: Guitar },
    { value: "piano", label: "Piano/Keyboard", icon: Piano },
    { value: "drums", label: "Drums", icon: Drum },
    { value: "vocals", label: "Vocals", icon: Mic },
    { value: "bass", label: "Bass", icon: Guitar },
    { value: "violin", label: "Violin", icon: Music },
    { value: "saxophone", label: "Saxophone", icon: Music },
    { value: "other", label: "Other", icon: Music },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-950/20 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-blue-600/5 rounded-full blur-3xl"></div>

      {/* Back to home button */}
      <Link
        to="/"
        className="fixed top-6 left-6 z-10 flex items-center text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Link>

      <Card className="w-full max-w-md border-purple-500/20 bg-gradient-to-br from-card via-card to-purple-950/5 relative">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Music className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">
              Join Motion Connect
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Create your account and start connecting with musicians
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Social Signup */}
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full border-purple-500/30 hover:bg-purple-500/10"
              type="button"
              onClick={handleGoogleSignUp}
              disabled={isGoogleLoading}
            >
              <Chrome className="w-4 h-4 mr-2" />
              {isGoogleLoading ? "Creating account..." : "Continue with Google"}
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full bg-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or create account with email
              </span>
            </div>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  {...register("fullName")}
                  id="fullName"
                  type="text"
                  placeholder="Your full name"
                  className="pl-10 border-purple-500/30 focus:border-purple-500 focus:ring-purple-500/20"
                />
              </div>
              {errors.fullName && (
                <p className="text-sm text-red-400">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  {...register("email")}
                  id="email"
                  type="email"
                  placeholder="musician@example.com"
                  className="pl-10 border-purple-500/30 focus:border-purple-500 focus:ring-purple-500/20"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  {...register("password")}
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  className="pl-10 border-purple-500/30 focus:border-purple-500 focus:ring-purple-500/20"
                />
              </div>
              {errors.password && (
                <p className="text-sm text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  {...register("confirmPassword")}
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  className="pl-10 border-purple-500/30 focus:border-purple-500 focus:ring-purple-500/20"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-400">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="instrument" className="text-sm font-medium">
                Primary Instrument{" "}
                <span className="text-muted-foreground">(Optional)</span>
              </Label>
              <Controller
                name="instrument"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="border-purple-500/30 focus:border-purple-500 focus:ring-purple-500/20">
                      <SelectValue placeholder="Select your main instrument" />
                    </SelectTrigger>
                    <SelectContent>
                      {instruments.map((instrument) => (
                        <SelectItem
                          key={instrument.value}
                          value={instrument.value}
                        >
                          <div className="flex items-center">
                            <instrument.icon className="w-4 h-4 mr-2" />
                            {instrument.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                {...register("agreeToTerms")}
                id="agreeToTerms"
                className="border-purple-500/30 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600 mt-1"
              />
              <Label
                htmlFor="agreeToTerms"
                className="text-sm text-muted-foreground leading-relaxed"
              >
                I agree to the{" "}
                <Link
                  to="/terms"
                  className="text-purple-400 hover:text-purple-300"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="text-purple-400 hover:text-purple-300"
                >
                  Privacy Policy
                </Link>
              </Label>
            </div>
            {errors.agreeToTerms && (
              <p className="text-sm text-red-400">
                {errors.agreeToTerms.message}
              </p>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
            >
              Sign in here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
