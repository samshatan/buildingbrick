export type WorkerCategory = {
  id: string;
  name: string;
  icon: string; // Emoji or image URL
  types: string[];
};

export const workerCategories: WorkerCategory[] = [
  {
    id: "construction",
    name: "Construction",
    icon: "🏗️",
    types: [
      "Contractor",
      "Bricklayer",
      "Painter",
      "Helper",
      "Carpenter/Woodworker",
      "Road Construction Laborer",
      "Demolition Worker",
    ],
  },
  {
    id: "domestic",
    name: "Domestic",
    icon: "🧹",
    types: ["House Helps", "Cooks", "Maids"],
  },
  {
    id: "utilities",
    name: "Utilities",
    icon: "🔧",
    types: [
      "Electrician",
      "Plumber",
      "Water Proofing Specialist",
      "Lift Installation and Service Engineer"
    ],
  },
  {
    id: "interior",
    name: "Interior",
    icon: "🛋️",
    types: [
      "Carpenter",
      "Flooring Mason (Tile Setter)",
      "Marble Polisher / Kharai Wale",
      "POP and Putty Artisan",
      "Painter",
      "Welder (Fabrication)",
    ],
  },
  {
    id: "security",
    name: "Security",
    icon: "🛡️",
    types: ["Watchman", "Security Guard"],
  },
];
