import { redirect } from "react-router";

/**
 * A simple guard that redirects to the login path if the user is not authenticated.
 * @param hasUser - Whether the user is currently authenticated (usually from a store).
 * @param loginPath - The path to redirect to if not authenticated.
 */
export function isAuthenticated(hasUser: boolean, loginPath = "/auth/login") {
  if (!hasUser) {
    return redirect(loginPath);
  }
  return { isAuthenticated: true };
}
