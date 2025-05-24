import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertApplicationSchema, 
  loginSchema,
  type LoginRequest 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }
      
      const user = await storage.createUser(userData);
      const { password, ...userWithoutPassword } = user;
      
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(400).json({ message: "Invalid user data", error });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(400).json({ message: "Invalid login data", error });
    }
  });

  // User routes
  app.get("/api/user/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user", error });
    }
  });

  // Application routes
  app.post("/api/applications", async (req, res) => {
    try {
      const applicationData = insertApplicationSchema.parse(req.body);
      
      // Calculate estimated vehicle value
      const estimatedValue = calculateVehicleValue(
        applicationData.vehicleMake,
        applicationData.vehicleModel,
        applicationData.vehicleYear
      );
      
      const application = await storage.createApplication({
        ...applicationData,
        estimatedVehicleValue: estimatedValue.toString(),
      });
      
      // Generate loan offers from all MFIs
      const mfis = await storage.getAllMfis();
      const loanAmount = parseFloat(applicationData.loanAmount);
      const loanTerm = applicationData.loanTerm;
      
      for (const mfi of mfis) {
        const offer = calculateLoanOffer(mfi, loanAmount, loanTerm);
        await storage.createLoanOffer({
          applicationId: application.id,
          mfiId: mfi.id,
          ...offer,
        });
      }
      
      res.json(application);
    } catch (error) {
      res.status(400).json({ message: "Failed to create application", error });
    }
  });

  app.get("/api/applications/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const applications = await storage.getApplicationsByUserId(userId);
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: "Failed to get applications", error });
    }
  });

  app.get("/api/applications/:id", async (req, res) => {
    try {
      const applicationId = parseInt(req.params.id);
      const application = await storage.getApplication(applicationId);
      
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      
      res.json(application);
    } catch (error) {
      res.status(500).json({ message: "Failed to get application", error });
    }
  });

  app.get("/api/applications/:id/offers", async (req, res) => {
    try {
      const applicationId = parseInt(req.params.id);
      const offers = await storage.getLoanOffersByApplicationId(applicationId);
      
      // Get MFI details for each offer
      const offersWithMfi = await Promise.all(
        offers.map(async (offer) => {
          const mfi = await storage.getMfi(offer.mfiId);
          return { ...offer, mfi };
        })
      );
      
      res.json(offersWithMfi);
    } catch (error) {
      res.status(500).json({ message: "Failed to get loan offers", error });
    }
  });

  app.post("/api/applications/:id/select-offer", async (req, res) => {
    try {
      const applicationId = parseInt(req.params.id);
      const { offerId } = req.body;
      
      // Deselect all other offers for this application
      const offers = await storage.getLoanOffersByApplicationId(applicationId);
      for (const offer of offers) {
        await storage.updateLoanOfferSelection(offer.id, offer.id === offerId);
      }
      
      // Get the selected offer to find the MFI
      const selectedOffer = offers.find(o => o.id === offerId);
      if (selectedOffer) {
        await storage.updateApplicationMfi(applicationId, selectedOffer.mfiId);
        await storage.updateApplicationStatus(applicationId, "under_review");
        
        // Add status update
        await storage.addStatusHistory({
          applicationId,
          status: "under_review",
          statusMessage: "MFI selected and application is under review",
        });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to select offer", error });
    }
  });

  app.get("/api/applications/:id/status-history", async (req, res) => {
    try {
      const applicationId = parseInt(req.params.id);
      const history = await storage.getStatusHistory(applicationId);
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: "Failed to get status history", error });
    }
  });

  // MFI routes
  app.get("/api/mfis", async (req, res) => {
    try {
      const mfis = await storage.getAllMfis();
      res.json(mfis);
    } catch (error) {
      res.status(500).json({ message: "Failed to get MFIs", error });
    }
  });

  // Vehicle valuation endpoint
  app.post("/api/vehicle/valuation", async (req, res) => {
    try {
      const { make, model, year } = req.body;
      const value = calculateVehicleValue(make, model, year);
      
      res.json({
        estimatedValue: value,
        maxLoanAmount: Math.floor(value * 0.7), // 70% LTV
        currency: "KES"
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to calculate vehicle value", error });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper functions
function calculateVehicleValue(make: string, model: string, year: number): number {
  // Basic vehicle valuation algorithm
  const baseValues: Record<string, number> = {
    toyota: 800000,
    nissan: 750000,
    honda: 700000,
    mazda: 650000,
    mitsubishi: 600000,
  };
  
  const baseValue = baseValues[make.toLowerCase()] || 500000;
  const currentYear = new Date().getFullYear();
  const age = currentYear - year;
  
  // Depreciation: 8% per year for the first 5 years, then 5% per year
  let depreciationRate = 0;
  if (age <= 5) {
    depreciationRate = age * 0.08;
  } else {
    depreciationRate = 0.4 + (age - 5) * 0.05; // 40% for first 5 years
  }
  
  const depreciatedValue = baseValue * (1 - Math.min(depreciationRate, 0.8)); // Max 80% depreciation
  return Math.max(Math.floor(depreciatedValue), 150000); // Minimum value of KES 150,000
}

function calculateLoanOffer(mfi: any, loanAmount: number, loanTermMonths: number) {
  const interestRate = parseFloat(mfi.interestRate);
  const processingFee = parseFloat(mfi.processingFee);
  
  let monthlyInterestRate: number;
  
  // Convert interest rate to monthly
  if (mfi.rateType === "weekly") {
    monthlyInterestRate = (interestRate / 100) * 4.33; // Average weeks per month
  } else if (mfi.rateType === "monthly") {
    monthlyInterestRate = interestRate / 100;
  } else { // annual
    monthlyInterestRate = (interestRate / 100) / 12;
  }
  
  // Calculate monthly payment using standard loan formula
  const monthlyPayment = loanAmount * 
    (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTermMonths)) /
    (Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1);
  
  const totalPayment = monthlyPayment * loanTermMonths;
  const totalInterest = totalPayment - loanAmount;
  
  return {
    interestRate: mfi.interestRate,
    monthlyPayment: Math.round(monthlyPayment).toString(),
    totalInterest: Math.round(totalInterest).toString(),
    processingFee: processingFee.toString(),
    approvalTimeHours: mfi.approvalTimeHours,
    isSelected: false,
  };
}
