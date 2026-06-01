export type WorkerCategory = {
  id: string;
  name: string;
  types: string[];
};

export type WorkerProfile = {
  id: string;
  name: string;
  type: string;
  categoryId: string;
  location: string;
  experience: string;
  dailyRate: number;
  rating: number;
  jobsCompleted: number;
  availability: "Available" | "Working";
  priority: string | null;
  verified: boolean;
  featured?: boolean;
};

export const workerSubscriptionPlan = {
  fee: 118,
  durationMonths: 3,
  renewalNote: "Renew every 3 months or your account becomes a normal user.",
};

export const workerCategories: WorkerCategory[] = [
  {
    id: "construction",
    name: "Construction Workers",
    types: [
      "Contractors",
      "Bricklayers",
      "Painters",
      "Helper",
      "Carpenters",
      "Masons",
      "Stone Cutters",
      "Road Construction Laborers",
      "Demolition Workers",
    ],
  },
  {
    id: "agriculture",
    name: "Agriculture Workers",
    types: [
      "Small Marginal Farmers",
      "Agriculture Workers",
      "Sharecroppers",
      "Daily Livestock Workers",
    ],
  },
  {
    id: "domestic",
    name: "Domestic Workers",
    types: ["House Helps", "Cooks", "Maids", "Cleaners"],
  },
  {
    id: "utilities",
    name: "Concealed Utilities and Core Services",
    types: [
      "Electrician",
      "Plumber",
      "Water proofing specialist",
    ],
  },
  {
    id: "interior",
    name: "Interior and Finishing Works",
    types: [
      "Carpenter",
      "Flooring Mason (Tile Setter)",
      "Marble Polisher / Kharai Wale",
      "Pottiyand POP artisan",
      "Painter",
      "Welder (Fabrication)",
    ],
  },
];

