import {
  Smartphone,
  Laptop,
  Shirt,
  Footprints,
  Cpu,
  Watch,
  Home as HomeIcon,
  Sofa,
  BookOpen,
  Dumbbell,
  Baby,
  Gem,
  Utensils,
  Gamepad2,
  Package,
} from "lucide-react";

// Add a new entry any time a category needs a specific icon — keywords are
// matched case-insensitively against the category name, first match wins.
// A category that doesn't match anything here still renders fine: it just
// falls back to the generic Package icon below, so nothing breaks when a
// new category is added on the backend before this list is updated.
const CATEGORY_ICON_MAP = [
  { keywords: ["mobile", "phone", "smartphone"], icon: Smartphone },
  { keywords: ["laptop", "computer", "pc"], icon: Laptop },
  { keywords: ["electronic"], icon: Cpu },
  { keywords: ["cloth", "apparel", "fashion", "wear"], icon: Shirt },
  { keywords: ["shoe", "sneaker", "footwear"], icon: Footprints },
  { keywords: ["watch"], icon: Watch },
  { keywords: ["furniture", "sofa"], icon: Sofa },
  { keywords: ["home", "kitchen", "decor"], icon: HomeIcon },
  { keywords: ["book"], icon: BookOpen },
  { keywords: ["fitness", "sport", "gym"], icon: Dumbbell },
  { keywords: ["baby", "kids", "toy"], icon: Baby },
  { keywords: ["jewel", "accessor"], icon: Gem },
  { keywords: ["food", "grocery", "kitchen"], icon: Utensils },
  { keywords: ["game", "gaming"], icon: Gamepad2 },
];

const DEFAULT_ICON = Package;

export function getCategoryIcon(categoryName = "") {
  const name = categoryName.toLowerCase();
  const match = CATEGORY_ICON_MAP.find((entry) => entry.keywords.some((kw) => name.includes(kw)));
  return match?.icon || DEFAULT_ICON;
}