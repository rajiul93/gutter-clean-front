"use server";

import { apiUrl, parseApi } from "@/lib/api";

export type HeroLeadFormState = {
  error?: string;
  success?: boolean;
};

function digitsOnly(phone: string) {
  return phone.replace(/\D/g, "");
}

export async function submitHeroLead(
  _prevState: HeroLeadFormState,
  formData: FormData,
): Promise<HeroLeadFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  if (!name || !location || !phone) {
    return { error: "Please fill in name, location, and phone." };
  }

  if (name.length > 200) {
    return { error: "Name is too long." };
  }

  if (location.length < 3) {
    return { error: "Please enter a more complete location." };
  }

  if (location.length > 2000) {
    return { error: "Location is too long." };
  }

  if (digitsOnly(phone).length < 5) {
    return { error: "Please enter a valid phone number." };
  }

  try {
    const res = await fetch(apiUrl("/api/v1/hero-leads"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, location, phone }),
    });
    await parseApi<{ _id: string }>(res);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not submit." };
  }

  return { success: true };
}
