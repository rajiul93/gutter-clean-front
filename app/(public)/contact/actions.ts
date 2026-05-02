"use server";

export type ContactFormState = {
  error?: string;
  success?: boolean;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function submitContact(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!email || !title || !description) {
    return { error: "Please fill in email, title, and description." };
  }

  if (!isValidEmail(email)) {
    return { error: "Please enter a valid email address." };
  }

  // Wire Resend / SendGrid / etc. here when ready.
  return { success: true };
}
