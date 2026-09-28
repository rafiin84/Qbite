import type { StaffMember, User } from "@/types";
import { wait } from "@/lib/mock/latency";
import { findConsumerByEmail, findStaffByEmail } from "@/lib/mock/seed-users";
import { ApiError } from "./errors";

export interface ConsumerSession {
  kind: "consumer";
  user: User;
}

export interface StaffSession {
  kind: "staff";
  user: StaffMember;
}

export async function loginConsumer(email: string): Promise<ConsumerSession> {
  await wait();
  const user = findConsumerByEmail(email.trim());
  if (!user) {
    throw new ApiError("We couldn't find that account. Try one of the demo accounts below.");
  }
  return { kind: "consumer", user };
}

export async function loginStaff(email: string): Promise<StaffSession> {
  await wait();
  const user = findStaffByEmail(email.trim());
  if (!user) {
    throw new ApiError("We couldn't find that staff account. Try one of the demo accounts below.");
  }
  return { kind: "staff", user };
}
