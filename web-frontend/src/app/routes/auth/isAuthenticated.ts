import { redirect } from "react-router";

export async function isAuthenticated() {
  const userStore = localStorage.getItem("user-store");
  if(!userStore){
    return redirect("/auth/login");
  }
  const isLoggedIn = JSON.parse(userStore).state.isLoggedIn;
  if (!isLoggedIn) {
    return redirect("/auth/login");
  }
  return { isAuthenticated: true };
}
