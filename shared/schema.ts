import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  phoneNumber: text("phone_number").notNull(),
  idNumber: text("id_number").notNull().unique(),
  password: text("password").notNull(),
  monthlyIncome: decimal("monthly_income"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  status: text("status").notNull().default("submitted"), // submitted, under_review, approved, disbursed, rejected
  loanAmount: decimal("loan_amount").notNull(),
  loanTerm: integer("loan_term").notNull(), // in months
  loanPurpose: text("loan_purpose").notNull(),
  vehicleMake: text("vehicle_make").notNull(),
  vehicleModel: text("vehicle_model").notNull(),
  vehicleYear: integer("vehicle_year").notNull(),
  vehicleRegistrationNumber: text("vehicle_registration_number").notNull(),
  estimatedVehicleValue: decimal("estimated_vehicle_value"),
  selectedMfiId: integer("selected_mfi_id"),
  applicationId: text("application_id").notNull().unique(),
  submittedAt: timestamp("submitted_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const mfis = pgTable("mfis", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  interestRate: decimal("interest_rate").notNull(),
  rateType: text("rate_type").notNull(), // weekly, monthly, annual
  processingFee: decimal("processing_fee").notNull(),
  approvalTimeHours: decimal("approval_time_hours").notNull(),
  rating: decimal("rating").notNull(),
  reviewCount: integer("review_count").notNull(),
  maxLtvRatio: decimal("max_ltv_ratio").notNull(), // loan-to-value ratio
  isActive: boolean("is_active").notNull().default(true),
});

export const loanOffers = pgTable("loan_offers", {
  id: serial("id").primaryKey(),
  applicationId: integer("application_id").notNull(),
  mfiId: integer("mfi_id").notNull(),
  interestRate: decimal("interest_rate").notNull(),
  monthlyPayment: decimal("monthly_payment").notNull(),
  totalInterest: decimal("total_interest").notNull(),
  processingFee: decimal("processing_fee").notNull(),
  approvalTimeHours: decimal("approval_time_hours").notNull(),
  isSelected: boolean("is_selected").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const applicationStatusHistory = pgTable("application_status_history", {
  id: serial("id").primaryKey(),
  applicationId: integer("application_id").notNull(),
  status: text("status").notNull(),
  statusMessage: text("status_message"),
  completedAt: timestamp("completed_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  submittedAt: true,
  updatedAt: true,
  applicationId: true,
});

export const insertMfiSchema = createInsertSchema(mfis).omit({
  id: true,
});

export const insertLoanOfferSchema = createInsertSchema(loanOffers).omit({
  id: true,
  createdAt: true,
});

export const insertApplicationStatusSchema = createInsertSchema(applicationStatusHistory).omit({
  id: true,
  completedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Application = typeof applications.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Mfi = typeof mfis.$inferSelect;
export type InsertMfi = z.infer<typeof insertMfiSchema>;
export type LoanOffer = typeof loanOffers.$inferSelect;
export type InsertLoanOffer = z.infer<typeof insertLoanOfferSchema>;
export type ApplicationStatusHistory = typeof applicationStatusHistory.$inferSelect;
export type InsertApplicationStatus = z.infer<typeof insertApplicationStatusSchema>;

// Login schema
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginRequest = z.infer<typeof loginSchema>;
