export function calculateVehicleValue(make: string, model: string, year: number): number {
  // Basic vehicle valuation algorithm for client-side estimation
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

export function calculateMaxLoanAmount(vehicleValue: number, ltvRatio: number = 0.7): number {
  return Math.floor(vehicleValue * ltvRatio);
}

export function getVehicleAgeCategory(year: number): string {
  const currentYear = new Date().getFullYear();
  const age = currentYear - year;
  
  if (age <= 3) return "New";
  if (age <= 7) return "Recent";
  if (age <= 12) return "Older";
  return "Vintage";
}
