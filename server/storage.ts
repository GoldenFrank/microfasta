import { 
  users, 
  applications, 
  mfis, 
  loanOffers, 
  applicationStatusHistory,
  type User, 
  type InsertUser, 
  type Application, 
  type InsertApplication,
  type Mfi,
  type InsertMfi,
  type LoanOffer,
  type InsertLoanOffer,
  type ApplicationStatusHistory,
  type InsertApplicationStatus
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Application operations
  createApplication(application: InsertApplication): Promise<Application>;
  getApplication(id: number): Promise<Application | undefined>;
  getApplicationsByUserId(userId: number): Promise<Application[]>;
  updateApplicationStatus(id: number, status: string): Promise<void>;
  updateApplicationMfi(id: number, mfiId: number): Promise<void>;
  
  // MFI operations
  getAllMfis(): Promise<Mfi[]>;
  getMfi(id: number): Promise<Mfi | undefined>;
  
  // Loan offer operations
  createLoanOffer(offer: InsertLoanOffer): Promise<LoanOffer>;
  getLoanOffersByApplicationId(applicationId: number): Promise<LoanOffer[]>;
  updateLoanOfferSelection(offerId: number, isSelected: boolean): Promise<void>;
  
  // Status history operations
  addStatusHistory(status: InsertApplicationStatus): Promise<ApplicationStatusHistory>;
  getStatusHistory(applicationId: number): Promise<ApplicationStatusHistory[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private applications: Map<number, Application>;
  private mfis: Map<number, Mfi>;
  private loanOffers: Map<number, LoanOffer>;
  private statusHistory: Map<number, ApplicationStatusHistory>;
  private currentUserId: number;
  private currentApplicationId: number;
  private currentMfiId: number;
  private currentOfferId: number;
  private currentStatusId: number;

  constructor() {
    this.users = new Map();
    this.applications = new Map();
    this.mfis = new Map();
    this.loanOffers = new Map();
    this.statusHistory = new Map();
    this.currentUserId = 1;
    this.currentApplicationId = 1;
    this.currentMfiId = 1;
    this.currentOfferId = 1;
    this.currentStatusId = 1;
    
    this.seedMfis();
  }

  private seedMfis() {
    const mfiData: InsertMfi[] = [
      {
        name: "Bashy African Credit",
        interestRate: "2.5",
        rateType: "weekly",
        processingFee: "2000",
        approvalTimeHours: "2",
        rating: "4.5",
        reviewCount: 1234,
        maxLtvRatio: "0.70",
        isActive: true,
      },
      {
        name: "Platinum Credit",
        interestRate: "3.0",
        rateType: "monthly",
        processingFee: "1500",
        approvalTimeHours: "2.5",
        rating: "4.2",
        reviewCount: 856,
        maxLtvRatio: "0.65",
        isActive: true,
      },
      {
        name: "Mogo Loans",
        interestRate: "2.8",
        rateType: "monthly",
        processingFee: "1200",
        approvalTimeHours: "1.5",
        rating: "4.8",
        reviewCount: 2156,
        maxLtvRatio: "0.75",
        isActive: true,
      },
    ];

    mfiData.forEach(mfi => {
      const id = this.currentMfiId++;
      this.mfis.set(id, { ...mfi, id });
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  async createApplication(insertApplication: InsertApplication): Promise<Application> {
    const id = this.currentApplicationId++;
    const applicationId = `MF-${new Date().getFullYear()}-${String(id).padStart(6, '0')}`;
    
    const application: Application = {
      ...insertApplication,
      id,
      applicationId,
      submittedAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.applications.set(id, application);
    
    // Add initial status
    await this.addStatusHistory({
      applicationId: id,
      status: "submitted",
      statusMessage: "Application has been received and is being processed",
    });
    
    return application;
  }

  async getApplication(id: number): Promise<Application | undefined> {
    return this.applications.get(id);
  }

  async getApplicationsByUserId(userId: number): Promise<Application[]> {
    return Array.from(this.applications.values()).filter(app => app.userId === userId);
  }

  async updateApplicationStatus(id: number, status: string): Promise<void> {
    const application = this.applications.get(id);
    if (application) {
      application.status = status;
      application.updatedAt = new Date();
      this.applications.set(id, application);
    }
  }

  async updateApplicationMfi(id: number, mfiId: number): Promise<void> {
    const application = this.applications.get(id);
    if (application) {
      application.selectedMfiId = mfiId;
      application.updatedAt = new Date();
      this.applications.set(id, application);
    }
  }

  async getAllMfis(): Promise<Mfi[]> {
    return Array.from(this.mfis.values()).filter(mfi => mfi.isActive);
  }

  async getMfi(id: number): Promise<Mfi | undefined> {
    return this.mfis.get(id);
  }

  async createLoanOffer(insertOffer: InsertLoanOffer): Promise<LoanOffer> {
    const id = this.currentOfferId++;
    const offer: LoanOffer = {
      ...insertOffer,
      id,
      createdAt: new Date(),
    };
    this.loanOffers.set(id, offer);
    return offer;
  }

  async getLoanOffersByApplicationId(applicationId: number): Promise<LoanOffer[]> {
    return Array.from(this.loanOffers.values()).filter(offer => offer.applicationId === applicationId);
  }

  async updateLoanOfferSelection(offerId: number, isSelected: boolean): Promise<void> {
    const offer = this.loanOffers.get(offerId);
    if (offer) {
      offer.isSelected = isSelected;
      this.loanOffers.set(offerId, offer);
    }
  }

  async addStatusHistory(insertStatus: InsertApplicationStatus): Promise<ApplicationStatusHistory> {
    const id = this.currentStatusId++;
    const status: ApplicationStatusHistory = {
      ...insertStatus,
      id,
      completedAt: new Date(),
    };
    this.statusHistory.set(id, status);
    return status;
  }

  async getStatusHistory(applicationId: number): Promise<ApplicationStatusHistory[]> {
    return Array.from(this.statusHistory.values())
      .filter(status => status.applicationId === applicationId)
      .sort((a, b) => (a.completedAt?.getTime() || 0) - (b.completedAt?.getTime() || 0));
  }
}

export const storage = new MemStorage();
