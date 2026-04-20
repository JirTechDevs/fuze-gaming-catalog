"use server";

import { createClient } from "@/lib/supabase/server";
import {
  createActionError,
  createActionSuccess,
  type ActionResult,
} from "@/lib/action-result";

export type LoginFormState = ActionResult;

export async function signInAction(
  _previousState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return createActionError("Email dan password wajib diisi.");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return createActionError("Login gagal. Cek email dan password kamu lagi.");
  }

  return createActionSuccess("Login berhasil.", "/dashboard");
}

export async function signOutAction(
  _previousState: ActionResult,
  _formData: FormData,
): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return createActionError("Logout gagal. Coba ulang lagi.");
  }

  return createActionSuccess("Logout berhasil.", "/login");
}
