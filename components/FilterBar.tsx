import type { Friction, OfferCategory, School } from "@/lib/offerTypes";
import { CategoryFilter } from "./CategoryFilter";
import { FrictionFilter } from "./FrictionFilter";
import { NearMeToggle } from "./NearMeToggle";
import { SchoolSelect } from "./SchoolSelect";

export function FilterBar({
  selectedCategories,
  selectedFrictions,
  selectedSchool,
  foodSelected,
  nearMeActive,
  nearMeError,
  onToggleCategory,
  onClearCategories,
  onToggleFriction,
  onSelectSchool,
  onToggleNearMe
}: {
  selectedCategories: OfferCategory[];
  selectedFrictions: Friction[];
  selectedSchool: School;
  foodSelected: boolean;
  nearMeActive: boolean;
  nearMeError: string | null;
  onToggleCategory: (category: OfferCategory) => void;
  onClearCategories: () => void;
  onToggleFriction: (friction: Friction) => void;
  onSelectSchool: (school: School) => void;
  onToggleNearMe: () => void;
}) {
  return (
    <div className="paper-grain border-y-2 border-ink px-4 py-5 shadow-card sm:px-6">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_1fr_auto_auto] lg:items-start">
        <CategoryFilter selected={selectedCategories} onToggle={onToggleCategory} onClear={onClearCategories} />
        <FrictionFilter selected={selectedFrictions} onToggle={onToggleFriction} />
        <SchoolSelect value={selectedSchool} onChange={onSelectSchool} />
        {foodSelected ? (
          <div className="lg:pt-7">
            <NearMeToggle active={nearMeActive} error={nearMeError} onToggle={onToggleNearMe} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
