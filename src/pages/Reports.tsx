import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Calculator, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useDebts } from "@/hooks/use-debts";
import { MainLayout } from "@/components/layout/MainLayout";
import { useToast } from "@/components/ui/use-toast";
import { OverviewTab } from "@/components/reports/OverviewTab";
import { AmortizationTab } from "@/components/reports/AmortizationTab";
import { PaymentTrendsTab } from "@/components/reports/PaymentTrendsTab";

export default function Reports() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const { toast } = useToast();
  const { debts } = useDebts();

  const { data: payments = [], isLoading: isPaymentsLoading } = useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      console.log("Fetching payment history for reports");
      const { data, error } = await supabase
        .from("payment_history")
        .select("*")
        .order("payment_date", { ascending: true });

      if (error) {
        console.error("Error fetching payment history:", error);
        throw error;
      }

      return data;
    },
  });

  const handleDownloadReport = (reportType: string) => {
    toast({
      title: "Coming Soon",
      description: `${reportType} report download will be available soon!`,
    });
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Financial Reports</h1>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="amortization" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Amortization
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Payment Trends
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab debts={debts || []} handleDownloadReport={handleDownloadReport} />
          </TabsContent>

          <TabsContent value="amortization">
            <AmortizationTab debts={debts || []} handleDownloadReport={handleDownloadReport} />
          </TabsContent>

          <TabsContent value="trends">
            <PaymentTrendsTab payments={payments} handleDownloadReport={handleDownloadReport} />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}