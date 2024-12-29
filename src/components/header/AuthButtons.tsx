import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Settings, LogIn } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { AuthForm } from "@/components/AuthForm";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AuthButtonsProps {
  user: any;
  profile: any;
  onAuthSuccess: () => void;
}

export const AuthButtons = ({ user, profile, onAuthSuccess }: AuthButtonsProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    console.log("Attempting to sign out");
    try {
      // Get the storage key for the current project
      const projectUrl = "https://cfbleqfvxyosenezksbc.supabase.co";
      const storageKey = `sb-${projectUrl.split('//')[1].split('.')[0]}-auth-token`;
      
      // First clear local storage to ensure we remove any stale session data
      localStorage.removeItem(storageKey);
      
      // Then attempt to sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign out error:", error);
        // Even if there's an error, we'll redirect to home since we've cleared the local session
      }
      
      // Always redirect to home and show success message
      window.location.href = '/';
      toast({
        title: "Signed out",
        description: "Successfully signed out of your account.",
      });
    } catch (error) {
      console.error("Sign out error:", error);
      // In case of any error, clear local storage and redirect
      const projectUrl = "https://cfbleqfvxyosenezksbc.supabase.co";
      const storageKey = `sb-${projectUrl.split('//')[1].split('.')[0]}-auth-token`;
      localStorage.removeItem(storageKey);
      window.location.href = '/';
      
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "You have been signed out locally. Please refresh the page if you experience any issues.",
      });
    }
  };

  const handleGetStarted = () => {
    if (user) {
      navigate("/planner");
    }
  };

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <Link to="/planner">
          <Button variant="outline" size="sm">
            Go to Planner
          </Button>
        </Link>
        {profile?.is_admin && (
          <Link to="/admin">
            <Button variant="outline" size="sm" className="gap-2">
              <Settings className="w-4 h-4" />
              Admin
            </Button>
          </Link>
        )}
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleSignOut}
        >
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            size="sm" 
            className="bg-primary hover:bg-primary/90"
            onClick={handleGetStarted}
          >
            Get Started
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-xl p-8 fixed top-[50vh] left-[50%] -translate-y-1/2 -translate-x-1/2">
          <DialogHeader />
          <div className="mt-8">
            <AuthForm onSuccess={onAuthSuccess} />
          </div>
        </DialogContent>
      </Dialog>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <LogIn className="w-4 h-4" />
            Sign In
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-xl p-8 fixed top-[50vh] left-[50%] -translate-y-1/2 -translate-x-1/2">
          <DialogHeader />
          <div className="mt-8">
            <AuthForm onSuccess={onAuthSuccess} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};