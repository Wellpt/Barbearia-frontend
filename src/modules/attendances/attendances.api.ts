import type { AuthContextValue } from "../auth/auth-context";
import { listCustomers } from "../customers/customers.api";
import { listProfessionals } from "../professionals/professionals.api";
import type { Attendance, AttendanceInput, AttendanceOptions, ServiceOption } from "./attendance.types";

type AuthenticatedRequest = AuthContextValue["request"];

export async function loadAttendanceOptions(request: AuthenticatedRequest, signal?: AbortSignal): Promise<AttendanceOptions> {
  const [customers, services, professionals] = await Promise.all([
    listCustomers(request, signal),
    request<ServiceOption[]>("/services", { signal }),
    listProfessionals(request, signal),
  ]);
  return { customers, services, professionals: professionals.filter(professional => professional.isActive) };
}

export function createAttendance(request: AuthenticatedRequest, input: AttendanceInput) {
  return request<Attendance>("/attendances", { method: "POST", body: input });
}
