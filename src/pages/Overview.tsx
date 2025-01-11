import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth";
import { useDebts } from "@/hooks/use-debts";
import { useOneTimeFunding } from "@/hooks/use-one-time-funding";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { OverviewHeader } from "@/components/overview/OverviewHeader";
import { OverviewProgress } from "@/components/overview/OverviewProgress";
import { OverviewChart } from "@/components/overview/OverviewChart";
import { OverviewSummary } from "@/components/overview/OverviewSummary";
import { DebtComparison } from "@/components/overview/DebtComparison";
import { DebtSnapshot } from "@/components/overview/DebtSnapshot";

const Overview = () => {
  const [currencySymbol, setCurrencySymbol] = useState<string>('£');
  const { toast } = useToast();
  const { user } = useAuth();
  const { debts, isLoading, profile } = useDebts();
  const { oneTimeFundings } = useOneTimeFunding();

  useEffect(() => {
    if (profile?.preferred_currency) {
      setCurrencySymbol(profile.preferred_currency);
    }
  }, [profile]);

  const handleCurrencyChange = async (newCurrency: string) => {
    setCurrencySymbol(newCurrency);
    
    if (!user?.id) return;

    const { error } = await supabase
      .from("profiles")
      .update({ preferred_currency: newCurrency })
      .eq("id", user.id);

    if (error) {
      console.error("Error saving currency preference:", error);
      toast({
        title: "Error",
        description: "Failed to save currency preference",
        variant: "destructive",
      });
      return;
    }
  };

  const totalMinimumPayments = debts?.reduce((sum, debt) => sum + debt.minimum_payment, 0) ?? 0;
  const totalDebt = debts?.reduce((sum, debt) => sum + debt.balance, 0) ?? 0;

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container py-8 space-y-8 px-4 sm:px-6 lg:px-8">
          <OverviewHeader
            currencySymbol={currencySymbol}
            onCurrencyChange={handleCurrencyChange}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <OverviewProgress
              totalDebt={totalDebt}
              currencySymbol={currencySymbol}
              oneTimeFundings={oneTimeFundings}
            />
            <DebtSnapshot
              debts={debts}
              currencySymbol={currencySymbol}
            />
          </div>

          <DebtComparison />

          {debts && debts.length > 0 && (
            <>
              <OverviewChart
                debts={debts}
                monthlyPayment={totalMinimumPayments}
                currencySymbol={currencySymbol}
                oneTimeFundings={oneTimeFundings}
              />

              <OverviewSummary oneTimeFundings={oneTimeFundings} />
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Overview;