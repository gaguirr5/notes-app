// src/lib/api/auth.ts
export async function signup(email: string, password: string) {
  const res = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "Signup failed");

  return data;
}

export async function login(email: string, password: string) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "Login failed");

  return data;
}

export async function logout() {
  await fetch("/api/auth/logout", { method: "POST" });
}

export async function getCurrentUser(): Promise<{ displayName: string }> {
  const res = await fetch("/api/auth/me");
  if (!res.ok) {
    throw new Error("Not authenticated");
  }
  return res.json();
}
