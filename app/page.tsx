"use client";

import { useEffect, useMemo, useState } from "react";
import offersData from "@/data/offers.json";
import { DEFAULT_FRICTIONS } from "@/lib/constants";
import { type GeoPoint } from "@/lib/distance";
import { applyOfferFilters } from "@/lib/filters";
import type { Friction, Offer, OfferCategory, School, StudentYear } from "@/lib/offerTypes";
import { readFiltersFromSearchParams, writeFiltersToUrl } from "@/lib/queryState";
import { FilterBar } from "@/components/FilterBar";
import { Header } from "@/components/Header";
import { OfferGrid } from "@/components/OfferGrid";
import { YearModal } from "@/components/YearModal";

const USER_YEAR_KEY = "user_year";
const offers = offersData as Offer[];

export default function DashboardPage() {
  const [hydrated, setHydrated] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<OfferCategory[]>([]);
  const [selectedFrictions, setSelectedFrictions] = useState<Friction[]>(DEFAULT_FRICTIONS);
  const [selectedSchool, setSelectedSchool] = useState<School>("ucla");
  const [selectedYear, setSelectedYear] = useState<StudentYear | null>(null);
  const [yearModalOpen, setYearModalOpen] = useState(false);
  const [nearMeActive, setNearMeActive] = useState(false);
  const [userLocation, setUserLocation] = useState<GeoPoint | null>(null);
  const [nearMeError, setNearMeError] = useState<string | null>(null);

  useEffect(() => {
    const parsed = readFiltersFromSearchParams(new URLSearchParams(window.location.search));
    setSelectedCategories(parsed.categories);
    setSelectedFrictions(parsed.frictions);
    setSelectedSchool(parsed.school);

    let storedYear: StudentYear | null = null;
    try {
      storedYear = window.localStorage.getItem(USER_YEAR_KEY) as StudentYear | null;
    } catch {
      storedYear = null;
    }

    if (storedYear) {
      setSelectedYear(storedYear);
    } else {
      setYearModalOpen(true);
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    writeFiltersToUrl({
      categories: selectedCategories,
      frictions: selectedFrictions,
      school: selectedSchool
    });
  }, [hydrated, selectedCategories, selectedFrictions, selectedSchool]);

  const foodSelected = selectedCategories.length === 0 || selectedCategories.includes("food");

  useEffect(() => {
    if (!foodSelected) {
      setNearMeActive(false);
      setNearMeError(null);
    }
  }, [foodSelected]);

  const filteredOffers = useMemo(
    () =>
      applyOfferFilters({
        offers,
        categories: selectedCategories,
        frictions: selectedFrictions,
        school: selectedSchool,
        userYear: selectedYear,
        nearMeActive,
        userLocation
      }),
    [nearMeActive, selectedCategories, selectedFrictions, selectedSchool, selectedYear, userLocation]
  );

  function toggleCategory(category: OfferCategory) {
    setSelectedCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category]
    );
  }

  function toggleFriction(friction: Friction) {
    setSelectedFrictions((current) =>
      current.includes(friction)
        ? current.filter((item) => item !== friction)
        : [...current, friction]
    );
  }

  function selectYear(year: StudentYear) {
    setSelectedYear(year);
    try {
      window.localStorage.setItem(USER_YEAR_KEY, year);
    } catch {
      // The choice still applies for the current page if storage is blocked.
    }
    setYearModalOpen(false);
  }

  function toggleNearMe() {
    if (nearMeActive) {
      setNearMeActive(false);
      setNearMeError(null);
      return;
    }

    if (!navigator.geolocation) {
      setNearMeError("Your browser does not support location sorting.");
      return;
    }

    setNearMeError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setNearMeActive(true);
      },
      () => {
        setNearMeError("Location permission was denied. Food offers still work without sorting.");
        setNearMeActive(false);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  }

  return (
    <main className="min-h-screen">
      <Header
        selectedYear={selectedYear}
        onChangeYear={() => setYearModalOpen(true)}
        offerCount={filteredOffers.length}
      />
      <FilterBar
        selectedCategories={selectedCategories}
        selectedFrictions={selectedFrictions}
        selectedSchool={selectedSchool}
        foodSelected={foodSelected}
        nearMeActive={nearMeActive}
        nearMeError={nearMeError}
        onToggleCategory={toggleCategory}
        onClearCategories={() => setSelectedCategories([])}
        onToggleFriction={toggleFriction}
        onSelectSchool={setSelectedSchool}
        onToggleNearMe={toggleNearMe}
      />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <OfferGrid offers={filteredOffers} nearMeActive={nearMeActive} hasYear={Boolean(selectedYear)} />
      </div>
      <YearModal
        open={yearModalOpen}
        selectedYear={selectedYear}
        onSelectYear={selectYear}
        onClose={() => setYearModalOpen(false)}
      />
    </main>
  );
}
