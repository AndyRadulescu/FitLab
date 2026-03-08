import { redirect } from "react-router";

export async function isAuthenticated(storeName = "user-store", loginPath = "/auth/login") {
  const userStore = localStorage.getItem(storeName);
  if(!userStore){
    return redirect(loginPath);
  }
  try {
    const userUid = JSON.parse(userStore)?.state?.user?.uid;
    if (!userUid) {
      return redirect(loginPath);
    }
  } catch {
    return redirect(loginPath);
  }
  return { isAuthenticated: true };
}
