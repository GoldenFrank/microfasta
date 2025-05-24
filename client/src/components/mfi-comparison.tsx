import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Star, Clock, Check, ArrowLeft } from "lucide-react";

interface MfiComparisonProps {
  applicationId: number;
}

export default function MfiComparison({ applicationId }: MfiComparisonProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedOfferId, setSelectedOfferId] = useState<number | null>(null);

  const { data: offers, isLoading } = useQuery({
    queryKey: [`/api/applications/${applicationId}/offers`],
  });

  const selectOfferMutation = useMutation({
    mutationFn: async (offerId: number) => {
      const response = await apiRequest("POST", `/api/applications/${applicationId}/select-offer`, {
        offerId,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/applications/${applicationId}`] });
      toast({
        title: "Offer selected!",
        description: "Your application is now under review. You'll be redirected to your dashboard.",
      });
      setTimeout(() => {
        setLocation("/dashboard");
      }, 2000);
    },
    onError: (error: any) => {
      toast({
        title: "Selection failed",
        description: error.message || "Failed to select offer",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading MFI offers...</p>
        </div>
      </div>
    );
  }

  if (!offers || offers.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No offers available at this time.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = () => {
    if (!selectedOfferId) {
      toast({
        title: "Please select an offer",
        description: "Choose one of the MFI offers to continue.",
        variant: "destructive",
      });
      return;
    }
    selectOfferMutation.mutate(selectedOfferId);
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-4 w-4 fill-current text-accent" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-4 w-4 fill-current text-accent opacity-50" />);
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }

    return stars;
  };

  const getApprovalTimeColor = (hours: string) => {
    const time = parseFloat(hours);
    if (time <= 2) return "text-success";
    if (time <= 3) return "text-accent";
    return "text-orange-500";
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <Card className="shadow-xl">
        <CardHeader className="bg-gradient-to-r from-primary to-blue-700 text-white">
          <CardTitle className="text-2xl md:text-3xl font-bold">Compare MFI Offers</CardTitle>
          <p className="text-blue-100">Choose the best offer for your needs</p>
        </CardHeader>

        <CardContent className="p-8">
          <RadioGroup
            value={selectedOfferId?.toString()}
            onValueChange={(value) => setSelectedOfferId(parseInt(value))}
            className="space-y-4"
          >
            {offers.map((offer: any) => (
              <Card
                key={offer.id}
                className={`border-2 transition-all duration-200 cursor-pointer hover:shadow-md ${
                  selectedOfferId === offer.id
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-primary/50"
                }`}
                onClick={() => setSelectedOfferId(offer.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <RadioGroupItem
                        value={offer.id.toString()}
                        id={`offer-${offer.id}`}
                        className="mt-1"
                      />
                      <div className="ml-4">
                        <h4 className="font-semibold text-foreground text-lg">
                          {offer.mfi?.name || "Unknown MFI"}
                        </h4>
                        <div className="flex items-center mt-1">
                          <div className="flex">
                            {renderStars(parseFloat(offer.mfi?.rating || "0"))}
                          </div>
                          <span className="ml-2 text-sm text-muted-foreground">
                            {offer.mfi?.rating} ({offer.mfi?.reviewCount?.toLocaleString()} reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {offer.interestRate}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {offer.mfi?.rateType || "per month"}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100">
                    <div>
                      <div className="text-sm text-muted-foreground">Monthly Payment</div>
                      <div className="font-semibold text-foreground">
                        KES {parseInt(offer.monthlyPayment).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Processing Fee</div>
                      <div className="font-semibold text-foreground">
                        KES {parseInt(offer.processingFee).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Approval Time</div>
                      <div className={`font-semibold ${getApprovalTimeColor(offer.approvalTimeHours)}`}>
                        {offer.approvalTimeHours} hours
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Total Interest</div>
                      <div className="font-semibold text-foreground">
                        KES {parseInt(offer.totalInterest).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </RadioGroup>

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              disabled={selectOfferMutation.isPending}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Application
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-success hover:bg-green-700"
              disabled={!selectedOfferId || selectOfferMutation.isPending}
            >
              {selectOfferMutation.isPending ? "Submitting..." : "Submit Application"}
              <Check className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
