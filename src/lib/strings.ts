export const stringIsBlank = (value: unknown) => {
  return typeof value !== "string" || value.trim() === "";
};

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
