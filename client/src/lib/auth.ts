import type { User } from "@shared/schema";

const USER_STORAGE_KEY = "microfasta_user";

export function getCurrentUser(): User | null {
  try {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: User): void {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

export function logout(): void {
  localStorage.removeItem(USER_STORAGE_KEY);
  window.location.href = "/";
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}
