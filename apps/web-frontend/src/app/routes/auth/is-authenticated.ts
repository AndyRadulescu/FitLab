import { redirect } from "react-router";

export async function isAuthenticated() {
  const userStore = localStorage.getItem("user-store");
  if(!userStore){
    return redirect("/auth/login");
  }
  try {
    const userUid = JSON.parse(userStore)?.state?.user?.uid;
    if (!userUid) {
      return redirect("/auth/login");
    }
  } catch {
    return redirect("/auth/login");
  }
  return { isAuthenticated: true };
}
