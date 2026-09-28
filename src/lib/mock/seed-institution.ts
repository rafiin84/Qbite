import type { Canteen, Institution } from "@/types";

export const institution: Institution = {
  id: "inst-abc-college",
  name: "ABC College of Engineering",
  location: "Coimbatore, Tamil Nadu",
  canteenIds: ["canteen-main"],
};

export const canteen: Canteen = {
  id: "canteen-main",
  institutionId: institution.id,
  name: "Main Canteen",
  description: "The heart of campus food -- south Indian breakfast, meals, and evening snacks.",
  status: "open",
  operatingHours: { opensAt: "08:00", closesAt: "18:00" },
  pickupWindow: { startsAt: "12:00", endsAt: "14:30" },
  averagePreparationMinutes: 4,
  preparationBufferMinutes: 3,
  location: "Block A, Ground Floor",
};
