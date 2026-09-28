import { useMutation } from "@tanstack/react-query";
import { loginConsumer, loginStaff } from "@/lib/api/session";
import { wait } from "@/lib/mock/latency";
import { staticData } from "@/lib/mock/db";
import { useSessionStore } from "@/store/session-store";
import type { ConsumerSignUpValues } from "@/lib/validation/auth";

export function useConsumerLogin() {
  const loginAsConsumer = useSessionStore((s) => s.loginAsConsumer);
  return useMutation({
    mutationFn: (email: string) => loginConsumer(email),
    onSuccess: (session) => loginAsConsumer(session.user),
  });
}

export function useConsumerSignUp() {
  const loginAsConsumer = useSessionStore((s) => s.loginAsConsumer);
  return useMutation({
    mutationFn: async (values: ConsumerSignUpValues) => {
      await wait(500, 900);
      return {
        id: `user-${Date.now()}`,
        name: values.name,
        email: values.email,
        phone: values.phone,
        role: "consumer" as const,
        institutionId: staticData.institution.id,
        canteenId: staticData.canteen.id,
      };
    },
    onSuccess: (user) => loginAsConsumer(user),
  });
}

export function useStaffLogin() {
  const loginAsStaff = useSessionStore((s) => s.loginAsStaff);
  return useMutation({
    mutationFn: (email: string) => loginStaff(email),
    onSuccess: (session) => loginAsStaff(session.user),
  });
}
