import { redirect } from "react-router";

export async function isAuthenticated() {
  const isAuthenticated = !!localStorage.getItem("user-store");

  if (!isAuthenticated) {
    return redirect("/login");
  }
  return { isAuthenticated: true };
}
