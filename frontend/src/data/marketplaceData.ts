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
      "Contractor",
      "Bricklayer",
      "Painter",
      "Helper",
      "Carpenter/Woodworker",
      "Mason/Rajmistri",
      "Road Construction Laborer",
      "Demolition Worker",
    ],
  },
  // {
  //   id: "agriculture",
  //   name: "Agriculture Workers",
  //   types: [
  //     "Small Marginal Farmers",
  //     "Agriculture Workers",
  //     "Sharecroppers",
  //     "Daily Livestock Workers",
  //   ],
  // },
  {
    id: "domestic",
    name: "Domestic Workers",
    types: ["House Helps", "Cooks", "Maids"],
  },
  {
    id: "utilities",
    name: "Concealed Utilities and Core Services",
    types: [
      "Electrician",
      "Plumber",
      "Water Proofing Specialist",
      "Lift Installation and Service Engineer"
    ],
  },
  {
    id: "interior",
    name: "Interior and Finishing Works",
    types: [
      "Carpenter",
      "Flooring Mason (Tile Setter)",
      "Marble Polisher / Kharai Wale",
      "POP and Putty Artisan",
      "Painter",
      "Welder (Fabrication)",
    ],
  },
];

