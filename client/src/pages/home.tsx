import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Car, Clock, Shield, Scale3d, Smartphone, Eye, Headphones } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-blue-700 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Get Your Logbook Loan in{" "}
                <span className="text-accent animate-bounce-subtle inline-block">3 Hours</span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
                Compare offers from top MFIs in Kenya. Fast approval, competitive rates, and transparent terms.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/application">
                  <Button 
                    size="lg" 
                    className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg font-semibold px-8 py-4 h-auto transform hover:scale-105 transition-all duration-200"
                  >
                    <Car className="mr-2 h-5 w-5" />
                    Start Application
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-white text-white hover:bg-white hover:text-primary text-lg font-semibold px-8 py-4 h-auto transition-all duration-200"
                >
                  <Clock className="mr-2 h-5 w-5" />
                  How It Works
                </Button>
              </div>
              <div className="flex items-center space-x-6 text-blue-100">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-success mr-2" />
                  <span>No Hidden Fees</span>
                </div>
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-success mr-2" />
                  <span>Secure Process</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-success mr-2" />
                  <span>3-Hour Approval</span>
                </div>
              </div>
            </div>
            <div className="lg:pl-8">
              <div className="relative mx-auto w-72 h-96 bg-dark-gray rounded-3xl p-2 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="w-full h-full bg-white rounded-2xl overflow-hidden relative">
                  <div className="bg-primary h-20 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">MicroFasta</span>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="bg-gray-100 rounded-lg h-8"></div>
                    <div className="bg-gray-100 rounded-lg h-6 w-3/4"></div>
                    <div className="bg-gray-100 rounded-lg h-6 w-1/2"></div>
                    <div className="bg-accent rounded-lg h-12 flex items-center justify-center mt-6">
                      <span className="text-dark-gray font-semibold">Apply Now</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dark-gray mb-4">
              Simple Process, Fast Results
            </h2>
            <p className="text-xl text-medium-gray max-w-2xl mx-auto">
              Our streamlined process gets you from application to cash in just 3 hours
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center group hover:transform hover:scale-105 transition-all duration-300 border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="bg-primary bg-opacity-10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <Car className="h-8 w-8 text-primary group-hover:text-white" />
                </div>
                <h3 className="text-lg font-semibold text-dark-gray mb-2">Apply Online</h3>
                <p className="text-medium-gray text-sm">Fill out our simple form with your details and vehicle information</p>
                <div className="text-xs text-accent font-semibold mt-2">~10 minutes</div>
              </CardContent>
            </Card>

            <Card className="text-center group hover:transform hover:scale-105 transition-all duration-300 border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="bg-secondary bg-opacity-10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary group-hover:text-white transition-all duration-300">
                  <Scale3d className="h-8 w-8 text-secondary group-hover:text-white" />
                </div>
                <h3 className="text-lg font-semibold text-dark-gray mb-2">Assessment</h3>
                <p className="text-medium-gray text-sm">We evaluate your affordability and vehicle value automatically</p>
                <div className="text-xs text-accent font-semibold mt-2">~45 minutes</div>
              </CardContent>
            </Card>

            <Card className="text-center group hover:transform hover:scale-105 transition-all duration-300 border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="bg-accent bg-opacity-10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent group-hover:text-white transition-all duration-300">
                  <Shield className="h-8 w-8 text-accent group-hover:text-white" />
                </div>
                <h3 className="text-lg font-semibold text-dark-gray mb-2">MFI Matching</h3>
                <p className="text-medium-gray text-sm">Compare offers from our partner MFIs and choose the best one</p>
                <div className="text-xs text-accent font-semibold mt-2">~30 minutes</div>
              </CardContent>
            </Card>

            <Card className="text-center group hover:transform hover:scale-105 transition-all duration-300 border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="bg-success bg-opacity-10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-success group-hover:text-white transition-all duration-300">
                  <Clock className="h-8 w-8 text-success group-hover:text-white" />
                </div>
                <h3 className="text-lg font-semibold text-dark-gray mb-2">Get Funded</h3>
                <p className="text-medium-gray text-sm">Receive funds directly to your M-Pesa or bank account</p>
                <div className="text-xs text-accent font-semibold mt-2">~10 minutes</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dark-gray mb-4">
              Why Choose MicroFasta?
            </h2>
            <p className="text-xl text-medium-gray max-w-2xl mx-auto">
              We've revolutionized the logbook loan process to save you time and money
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="bg-primary bg-opacity-10 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <Clock className="h-8 w-8 text-primary group-hover:text-white" />
                </div>
                <h3 className="text-xl font-semibold text-dark-gray mb-4">Lightning Fast</h3>
                <p className="text-medium-gray">Get approved and funded in just 3 hours, not days. Our automated process eliminates unnecessary delays.</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="bg-secondary bg-opacity-10 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-secondary group-hover:text-white transition-all duration-300">
                  <Shield className="h-8 w-8 text-secondary group-hover:text-white" />
                </div>
                <h3 className="text-xl font-semibold text-dark-gray mb-4">100% Secure</h3>
                <p className="text-medium-gray">Bank-level security with encrypted data transmission. Your personal and financial information is always protected.</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="bg-accent bg-opacity-10 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-all duration-300">
                  <Scale3d className="h-8 w-8 text-accent group-hover:text-white" />
                </div>
                <h3 className="text-xl font-semibold text-dark-gray mb-4">Best Rates</h3>
                <p className="text-medium-gray">Compare offers from multiple MFIs to find the best interest rates and terms that suit your needs.</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="bg-success bg-opacity-10 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-success group-hover:text-white transition-all duration-300">
                  <Smartphone className="h-8 w-8 text-success group-hover:text-white" />
                </div>
                <h3 className="text-xl font-semibold text-dark-gray mb-4">Mobile Optimized</h3>
                <p className="text-medium-gray">Apply from anywhere using your smartphone or computer with our responsive web platform.</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="bg-primary bg-opacity-10 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <Eye className="h-8 w-8 text-primary group-hover:text-white" />
                </div>
                <h3 className="text-xl font-semibold text-dark-gray mb-4">Transparent</h3>
                <p className="text-medium-gray">No hidden fees or surprises. All costs and terms are clearly displayed before you commit.</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="bg-secondary bg-opacity-10 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-secondary group-hover:text-white transition-all duration-300">
                  <Headphones className="h-8 w-8 text-secondary group-hover:text-white" />
                </div>
                <h3 className="text-xl font-semibold text-dark-gray mb-4">24/7 Support</h3>
                <p className="text-medium-gray">Get help whenever you need it. Our customer support team is available round the clock.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Get Your Loan?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of Kenyans who have trusted MicroFasta for their logbook loan needs
          </p>
          <Link href="/application">
            <Button 
              size="lg"
              className="bg-accent text-dark-gray hover:bg-yellow-500 text-lg font-semibold px-8 py-4 h-auto transform hover:scale-105 transition-all duration-200"
            >
              Start Your Application Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
