import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertApplicationSchema, type InsertApplication } from "@shared/schema";
import { getCurrentUser } from "@/lib/auth";
import { calculateVehicleValue } from "@/lib/vehicle-valuation";
import MfiComparison from "./mfi-comparison";
import { ArrowLeft, ArrowRight, Camera, Upload } from "lucide-react";
import { z } from "zod";

const formSchema = insertApplicationSchema.extend({
  vehicleValue: z.string().optional(),
  maxLoanAmount: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function ApplicationForm() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [applicationId, setApplicationId] = useState<number | null>(null);
  const [showMfiComparison, setShowMfiComparison] = useState(false);
  const currentUser = getCurrentUser();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: currentUser?.id || 0,
      loanAmount: "",
      loanTerm: 0,
      loanPurpose: "",
      vehicleMake: "",
      vehicleModel: "",
      vehicleYear: 0,
      vehicleRegistrationNumber: "",
    },
  });

  const { watch, setValue } = form;
  const watchedVehicle = watch(["vehicleMake", "vehicleModel", "vehicleYear"]);

  // Calculate vehicle value when vehicle details change
  const { data: vehicleValuation } = useQuery({
    queryKey: ["/api/vehicle/valuation", ...watchedVehicle],
    queryFn: async () => {
      const [make, model, year] = watchedVehicle;
      if (!make || !model || !year) return null;
      
      const response = await apiRequest("POST", "/api/vehicle/valuation", {
        make,
        model,
        year,
      });
      return response.json();
    },
    enabled: watchedVehicle.every(Boolean),
  });

  const createApplicationMutation = useMutation({
    mutationFn: async (data: InsertApplication) => {
      const response = await apiRequest("POST", "/api/applications", data);
      return response.json();
    },
    onSuccess: (data) => {
      setApplicationId(data.id);
      setShowMfiComparison(true);
      toast({
        title: "Application submitted!",
        description: "Now comparing offers from our MFI partners.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Application failed",
        description: error.message || "Failed to submit application",
        variant: "destructive",
      });
    },
  });

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">Please log in to continue your application</p>
            <Button onClick={() => setLocation("/login")}>Login</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showMfiComparison && applicationId) {
    return <MfiComparison applicationId={applicationId} />;
  }

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = (data: FormData) => {
    const { vehicleValue, maxLoanAmount, ...applicationData } = data;
    createApplicationMutation.mutate(applicationData);
  };

  const vehicleModels: Record<string, string[]> = {
    toyota: ["Vitz", "Fielder", "Axio", "Noah", "Harrier", "Prado"],
    nissan: ["Note", "March", "Wingroad", "X-Trail", "Patrol"],
    honda: ["Fit", "Civic", "Accord", "CR-V", "Pilot"],
    mazda: ["Demio", "Axela", "Atenza", "CX-5", "CX-7"],
    mitsubishi: ["Colt", "Lancer", "Outlander", "Pajero"],
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 15 }, (_, i) => currentYear - i);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <Card className="shadow-xl">
        <CardHeader className="bg-gradient-to-r from-primary to-blue-700 text-white">
          <CardTitle className="text-2xl md:text-3xl font-bold">Loan Application</CardTitle>
          <p className="text-blue-100">Complete in under 10 minutes</p>
          
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-blue-100">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-sm text-blue-100">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2 bg-blue-800" />
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="animate-fade-in space-y-6">
                <h3 className="text-xl font-semibold text-foreground mb-6">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={currentUser.fullName}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      value={currentUser.email}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      value={currentUser.phoneNumber}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="idNumber">ID Number</Label>
                    <Input
                      id="idNumber"
                      value={currentUser.idNumber}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monthlyIncome">Monthly Income (KES)</Label>
                  <Input
                    id="monthlyIncome"
                    value={currentUser.monthlyIncome || ""}
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="button" onClick={nextStep}>
                    Next Step
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Vehicle Information */}
            {currentStep === 2 && (
              <div className="animate-fade-in space-y-6">
                <h3 className="text-xl font-semibold text-foreground mb-6">Vehicle Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="vehicleMake">Vehicle Make *</Label>
                    <Select onValueChange={(value) => setValue("vehicleMake", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select make" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="toyota">Toyota</SelectItem>
                        <SelectItem value="nissan">Nissan</SelectItem>
                        <SelectItem value="honda">Honda</SelectItem>
                        <SelectItem value="mazda">Mazda</SelectItem>
                        <SelectItem value="mitsubishi">Mitsubishi</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.vehicleMake && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.vehicleMake.message}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="vehicleModel">Vehicle Model *</Label>
                    <Select 
                      onValueChange={(value) => setValue("vehicleModel", value)}
                      disabled={!watch("vehicleMake")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicleModels[watch("vehicleMake")]?.map((model) => (
                          <SelectItem key={model} value={model.toLowerCase()}>
                            {model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.vehicleModel && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.vehicleModel.message}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="vehicleYear">Year of Manufacture *</Label>
                    <Select onValueChange={(value) => setValue("vehicleYear", parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.vehicleYear && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.vehicleYear.message}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="vehicleRegistrationNumber">Registration Number *</Label>
                    <Input
                      id="vehicleRegistrationNumber"
                      placeholder="KXX XXX X"
                      {...form.register("vehicleRegistrationNumber")}
                    />
                    {form.formState.errors.vehicleRegistrationNumber && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.vehicleRegistrationNumber.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Logbook Upload</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Click to upload or scan your logbook</p>
                    <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG up to 5MB</p>
                  </div>
                </div>

                {vehicleValuation && (
                  <Card className="bg-muted/50">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-foreground mb-2">Estimated Vehicle Value</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Based on make, model, and year:</span>
                        <span className="text-xl font-bold text-primary">
                          KES {vehicleValuation.estimatedValue.toLocaleString()}
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        Maximum loan amount:{" "}
                        <span className="font-semibold text-foreground">
                          KES {vehicleValuation.maxLoanAmount.toLocaleString()}
                        </span>{" "}
                        (70% LTV)
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                  <Button type="button" onClick={nextStep}>
                    Next Step
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Loan Details */}
            {currentStep === 3 && (
              <div className="animate-fade-in space-y-6">
                <h3 className="text-xl font-semibold text-foreground mb-6">Loan Requirements</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="loanAmount">Loan Amount (KES) *</Label>
                    <Input
                      id="loanAmount"
                      type="number"
                      placeholder="100000"
                      {...form.register("loanAmount")}
                    />
                    {form.formState.errors.loanAmount && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.loanAmount.message}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="loanTerm">Repayment Period *</Label>
                    <Select onValueChange={(value) => setValue("loanTerm", parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 months</SelectItem>
                        <SelectItem value="6">6 months</SelectItem>
                        <SelectItem value="12">12 months</SelectItem>
                        <SelectItem value="24">24 months</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.loanTerm && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.loanTerm.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loanPurpose">Purpose of Loan</Label>
                  <Select onValueChange={(value) => setValue("loanPurpose", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="business">Business expansion</SelectItem>
                      <SelectItem value="personal">Personal expenses</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="medical">Medical expenses</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.loanPurpose && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.loanPurpose.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-success hover:bg-green-700"
                    disabled={createApplicationMutation.isPending}
                  >
                    {createApplicationMutation.isPending ? "Submitting..." : "Compare Offers"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
