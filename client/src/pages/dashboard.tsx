import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StatusTracker from "@/components/status-tracker";
import { getCurrentUser } from "@/lib/auth";
import { Phone, Download, Share2, Clock, CheckCircle, AlertCircle } from "lucide-react";

export default function Dashboard() {
  const currentUser = getCurrentUser();
  
  const { data: applications, isLoading } = useQuery({
    queryKey: [`/api/applications/user/${currentUser?.id}`],
    enabled: !!currentUser,
  });

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Please log in to view your dashboard</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="w-full max-w-2xl mx-auto">
            <CardContent className="pt-6 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">No Applications Found</h2>
              <p className="text-muted-foreground mb-6">You haven't submitted any loan applications yet.</p>
              <Button>Start New Application</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const latestApplication = applications[0];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-blue-100 text-blue-800";
      case "under_review":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "disbursed":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "submitted":
        return "Submitted";
      case "under_review":
        return "Under Review";
      case "approved":
        return "Approved";
      case "disbursed":
        return "Disbursed";
      case "rejected":
        return "Rejected";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Track your loan applications and manage your account</p>
        </div>

        {/* Application Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{applications.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Latest Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className={getStatusColor(latestApplication.status)}>
                {getStatusLabel(latestApplication.status)}
              </Badge>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Loan Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">KES {parseInt(latestApplication.loanAmount).toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Latest Application Details */}
        <Card className="mb-8">
          <CardHeader className="bg-gradient-to-r from-primary to-blue-700 text-white">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold">Latest Application</CardTitle>
                <p className="text-blue-100">Application ID: {latestApplication.applicationId}</p>
              </div>
              <Badge className={`${getStatusColor(latestApplication.status)} text-sm`}>
                {getStatusLabel(latestApplication.status)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div>
                <h4 className="font-medium text-muted-foreground text-sm">Vehicle</h4>
                <p className="font-semibold">{latestApplication.vehicleMake} {latestApplication.vehicleModel}</p>
                <p className="text-sm text-muted-foreground">{latestApplication.vehicleYear}</p>
              </div>
              <div>
                <h4 className="font-medium text-muted-foreground text-sm">Loan Amount</h4>
                <p className="font-semibold">KES {parseInt(latestApplication.loanAmount).toLocaleString()}</p>
              </div>
              <div>
                <h4 className="font-medium text-muted-foreground text-sm">Term</h4>
                <p className="font-semibold">{latestApplication.loanTerm} months</p>
              </div>
              <div>
                <h4 className="font-medium text-muted-foreground text-sm">Submitted</h4>
                <p className="font-semibold">
                  {new Date(latestApplication.submittedAt || '').toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Status Tracker */}
            <StatusTracker applicationId={latestApplication.id} />

            {/* Quick Actions */}
            <div className="border-t border-gray-200 pt-4 mt-6">
              <div className="flex flex-wrap gap-3">
                <Button className="bg-primary text-white hover:bg-blue-700">
                  <Phone className="mr-2 h-4 w-4" />
                  Contact Support
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download Receipt
                </Button>
                <Button variant="outline">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Status
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* All Applications */}
        {applications.length > 1 && (
          <Card>
            <CardHeader>
              <CardTitle>All Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {applications.map((app: any) => (
                  <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold">{app.applicationId}</h4>
                        <Badge className={getStatusColor(app.status)}>
                          {getStatusLabel(app.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {app.vehicleMake} {app.vehicleModel} • KES {parseInt(app.loanAmount).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {new Date(app.submittedAt || '').toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
