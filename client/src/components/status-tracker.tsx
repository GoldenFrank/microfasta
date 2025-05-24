import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Clock, Calculator, Car, Banknote, Circle } from "lucide-react";

interface StatusTrackerProps {
  applicationId: number;
}

export default function StatusTracker({ applicationId }: StatusTrackerProps) {
  const { data: statusHistory, isLoading } = useQuery({
    queryKey: [`/api/applications/${applicationId}/status-history`],
  });

  const { data: application } = useQuery({
    queryKey: [`/api/applications/${applicationId}`],
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const statusSteps = [
    {
      id: "submitted",
      title: "Application Submitted",
      description: "Your application has been received and is being processed",
      icon: CheckCircle,
    },
    {
      id: "document_verification",
      title: "Document Verification",
      description: "Your documents are being verified and approved",
      icon: CheckCircle,
    },
    {
      id: "credit_assessment",
      title: "Credit Assessment",
      description: "We're evaluating your creditworthiness and affordability",
      icon: Calculator,
    },
    {
      id: "vehicle_valuation",
      title: "Vehicle Valuation",
      description: "Assessing your vehicle's value for loan approval",
      icon: Car,
    },
    {
      id: "disbursement",
      title: "Fund Disbursement",
      description: "Funds are being transferred to your account",
      icon: Banknote,
    },
  ];

  const getStepStatus = (stepId: string) => {
    if (!application) return "pending";
    
    const currentStatus = application.status;
    
    // Define the status progression
    const statusOrder = [
      "submitted",
      "document_verification", 
      "credit_assessment",
      "vehicle_valuation",
      "disbursement"
    ];
    
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(stepId);
    
    if (stepIndex <= currentIndex) {
      return "completed";
    } else if (stepIndex === currentIndex + 1) {
      return "current";
    } else {
      return "pending";
    }
  };

  const getStatusIcon = (stepId: string, IconComponent: any) => {
    const status = getStepStatus(stepId);
    
    switch (status) {
      case "completed":
        return (
          <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-white" />
          </div>
        );
      case "current":
        return (
          <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center animate-pulse">
            <IconComponent className="h-6 w-6 text-dark-gray" />
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <IconComponent className="h-6 w-6 text-gray-500" />
          </div>
        );
    }
  };

  const getStatusText = (stepId: string) => {
    const status = getStepStatus(stepId);
    const historyItem = statusHistory?.find((h: any) => h.status === stepId);
    
    switch (status) {
      case "completed":
        return {
          color: "text-success",
          text: historyItem 
            ? `Completed on ${new Date(historyItem.completedAt).toLocaleString()}`
            : "Completed"
        };
      case "current":
        return {
          color: "text-accent",
          text: "In Progress - Estimated completion: 45 minutes"
        };
      default:
        return {
          color: "text-gray-400",
          text: "Pending previous steps completion"
        };
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <h4 className="font-semibold text-foreground mb-6">Application Progress</h4>
        
        <div className="space-y-6">
          {statusSteps.map((step, index) => {
            const statusInfo = getStatusText(step.id);
            const isCompleted = getStepStatus(step.id) === "completed";
            const isCurrent = getStepStatus(step.id) === "current";
            
            return (
              <div key={step.id} className="flex items-start space-x-4">
                {getStatusIcon(step.id, step.icon)}
                
                <div className="flex-1">
                  <h4 className={`text-lg font-semibold ${
                    isCompleted || isCurrent ? "text-foreground" : "text-gray-500"
                  }`}>
                    {step.title}
                  </h4>
                  <p className={`${
                    isCompleted || isCurrent ? "text-muted-foreground" : "text-gray-400"
                  }`}>
                    {step.description}
                  </p>
                  <p className={`text-sm mt-1 ${statusInfo.color} flex items-center`}>
                    {isCurrent && <Clock className="h-4 w-4 mr-1" />}
                    {statusInfo.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
