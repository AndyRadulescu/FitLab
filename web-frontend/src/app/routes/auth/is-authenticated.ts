import { redirect } from "react-router";

export async function isAuthenticated() {
  const userStore = localStorage.getItem("user-store");
  if(!userStore){
    return redirect("/auth/login");
  }
  const userUid = JSON.parse(userStore).state.uid;
  if (!userUid) {
    return redirect("/auth/login");
  }
  return { isAuthenticated: true };
}
