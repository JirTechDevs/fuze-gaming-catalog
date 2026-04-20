export type ActionStatus = "idle" | "success" | "error";

export type ActionResult = {
  status: ActionStatus;
  message: string | null;
  redirectTo: string | null;
};

export const initialActionResult: ActionResult = {
  status: "idle",
  message: null,
  redirectTo: null,
};

export function createActionError(message: string): ActionResult {
  return {
    status: "error",
    message,
    redirectTo: null,
  };
}

export function createActionSuccess(
  message: string,
  redirectTo: string | null = null,
): ActionResult {
  return {
    status: "success",
    message,
    redirectTo,
  };
}
