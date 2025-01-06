import { MainLayout } from "@/components/layout/MainLayout";
import { useDebts } from "@/hooks/use-debts";
import { useState } from "react";
import { ExtraPaymentDialog } from "@/components/strategy/ExtraPaymentDialog";
import { useProfile } from "@/hooks/use-profile";
import { StrategyHeader } from "@/components/strategy/StrategyHeader";
import { StrategyContent } from "@/components/strategy/StrategyContent";
import { strategies } from "@/lib/strategies";
import type { Debt } from "@/lib/types";
import { Loader2 } from "lucide-react";

export default function Strategy() {
  const { debts, updateDebt: updateDebtMutation, deleteDebt: deleteDebtMutation, isLoading: isDebtsLoading } = useDebts();
  const { profile, updateProfile, isLoading: isProfileLoading } = useProfile();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState(strategies[0]);
  
  // Show loading state while data is being fetched
  if (isDebtsLoading || isProfileLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }
  
  const totalMinimumPayments = debts?.reduce((sum, debt) => sum + debt.minimum_payment, 0) ?? 0;
  const totalDebtValue = debts?.reduce((sum, debt) => sum + debt.balance, 0) ?? 0;
  const extraPayment = profile?.monthly_payment 
    ? Math.max(0, profile.monthly_payment - totalMinimumPayments)
    : 0;

  const totalMonthlyPayment = totalMinimumPayments + extraPayment;

  const handleSaveExtra = async (amount: number) => {
    if (!profile) {
      console.error("No profile available for update");
      return;
    }
    
    const totalPayment = totalMinimumPayments + amount;
    console.log('Updating monthly payment to:', totalPayment);
    try {
      await updateProfile.mutateAsync({
        ...profile,
        monthly_payment: totalPayment
      });
    } catch (error) {
      console.error("Failed to update monthly payment:", error);
    }
  };

  const handleUpdateDebt = (updatedDebt: Debt) => {
    console.log('Updating debt:', updatedDebt);
    updateDebtMutation.mutate(updatedDebt);
  };

  const handleDeleteDebt = (debtId: string) => {
    console.log('Deleting debt:', debtId);
    deleteDebtMutation.mutate(debtId);
  };

  return (
    <MainLayout>
      <div className="bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container max-w-7xl py-8 space-y-8">
          <StrategyHeader />
          
          <StrategyContent
            debts={debts || []}
            totalMinimumPayments={totalMinimumPayments}
            extraPayment={extraPayment}
            totalMonthlyPayment={totalMonthlyPayment}
            selectedStrategy={selectedStrategy}
            onExtraPaymentChange={handleSaveExtra}
            onOpenExtraPaymentDialog={() => setIsDialogOpen(true)}
            onUpdateDebt={handleUpdateDebt}
            onDeleteDebt={handleDeleteDebt}
            onSelectStrategy={setSelectedStrategy}
            preferredCurrency={profile?.preferred_currency}
            totalDebtValue={totalDebtValue}
          />
        </div>
      </div>

      <ExtraPaymentDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        currentPayment={totalMinimumPayments}
        onSave={handleSaveExtra}
        currencySymbol={profile?.preferred_currency || "£"}
        maxValue={totalDebtValue}
      />
    </MainLayout>
  );
}