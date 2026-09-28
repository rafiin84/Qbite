import type { StaffMember, User } from "@/types";
import { canteen, institution } from "./seed-institution";

export const consumers: User[] = [
  {
    id: "user-arjun",
    name: "Arjun Menon",
    email: "arjun.menon@abc.edu",
    phone: "+91 98765 43210",
    role: "consumer",
    institutionId: institution.id,
    canteenId: canteen.id,
  },
  {
    id: "user-priya",
    name: "Priya Sundaram",
    email: "priya.sundaram@abc.edu",
    phone: "+91 91234 56789",
    role: "consumer",
    institutionId: institution.id,
    canteenId: canteen.id,
  },
  {
    id: "user-karthik",
    name: "Karthik Raja",
    email: "karthik.raja@abc.edu",
    phone: "+91 90000 11223",
    role: "consumer",
    institutionId: institution.id,
    canteenId: canteen.id,
  },
];

export const staffMembers: StaffMember[] = [
  {
    id: "staff-lakshmi",
    name: "Lakshmi Narayanan",
    email: "lakshmi.n@abccanteen.in",
    role: "staff",
    canteenId: canteen.id,
    title: "Canteen Supervisor",
  },
  {
    id: "staff-vignesh",
    name: "Vignesh Kumar",
    email: "vignesh.k@abccanteen.in",
    role: "staff",
    canteenId: canteen.id,
    title: "Kitchen Staff",
  },
];

export function findConsumerByEmail(email: string): User | undefined {
  return consumers.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function findStaffByEmail(email: string): StaffMember | undefined {
  return staffMembers.find((s) => s.email.toLowerCase() === email.toLowerCase());
}
