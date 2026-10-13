import { API_BASE_URL } from "./env";
import type { ChatMessage, Consultation, IntakeResponse } from "./types";
import { toCsv, type IntakeFormValues } from "./schemas";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed with ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function submitIntake(values: IntakeFormValues) {
  const payload = {
    ...values,
    medicalHistory: toCsv(values.medicalHistory),
    currentMedications: toCsv(values.currentMedications),
    allergies: toCsv(values.allergies),
  };

  return request<IntakeResponse>("/api/intake", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function fetchQueue() {
  return request<{ consultations: Consultation[] }>("/api/consultations");
}

export function fetchConsultation(id: string) {
  return request<{ consultation: Consultation }>(`/api/consultations/${id}`);
}

export function updateConsultationStatus(
  id: string,
  status: Consultation["status"],
  clinicianName?: string
) {
  return request<{ consultation: Consultation }>(`/api/consultations/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status, clinicianName }),
  });
}

export function fetchMessageHistory(roomId: string) {
  return request<{ messages: ChatMessage[] }>(`/api/messages/${roomId}`);
}
