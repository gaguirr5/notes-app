import { describe, it, expect } from "vitest";
import { stringIsBlank, isValidEmail } from "@/lib/strings";

describe("stringIsBlank", () => {
  it("returns true for an empty string", () => {
    expect(stringIsBlank("")).toBe(true);
  });

  it("returns true for a whitespace-only string", () => {
    expect(stringIsBlank("   ")).toBe(true);
  });

  it("returns true for a non-string value", () => {
    expect(stringIsBlank(undefined)).toBe(true);
    expect(stringIsBlank(123)).toBe(true);
  });

  it("returns false for a non-empty string", () => {
    expect(stringIsBlank("hello")).toBe(false);
  });
});

describe("isValidEmail", () => {
  it("returns true for a valid email", () => {
    expect(isValidEmail("test@example.com")).toBe(true);
  });

  it("returns false when missing an @", () => {
    expect(isValidEmail("testexample.com")).toBe(false);
  });

  it("returns false when missing a domain", () => {
    expect(isValidEmail("test@")).toBe(false);
  });

  it("returns false for an empty string", () => {
    expect(isValidEmail("")).toBe(false);
  });
});