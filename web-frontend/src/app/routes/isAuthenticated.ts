import { redirect } from "react-router";

export async function isAuthenticated() {
  const userStore = localStorage.getItem("user-store");
  if(!userStore){
    return redirect("/login");
  }
  const isLoggedIn = JSON.parse(userStore).state.isLoggedIn;
  if (!isLoggedIn) {
    return redirect("/login");
  }
  return { isAuthenticated: true };
}
