import { parseOneAddress } from "email-addresses";
import { useState } from "react";

export function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

export function toKebab(string) {
  return string
    .split("")
    .map((letter) => {
      if (/[A-Z]/.test(letter)) {
        return ` ${letter.toLowerCase()}`;
      }
      return letter;
    })
    .join("")
    .trim()
    .replace(/[_\s]+/g, "-");
}

export const isSSR = typeof window !== "undefined";

export function useSessionStorage(key, initialValue) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    if (!isSSR) return initialValue;
    try {
      // Get from local storage by key
      const item = window.sessionStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to sessionStorage.
  const setValue = (value) => {
    if (!isSSR) return "";
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };

  return [storedValue, setValue];
}

export function validateEmail(email: string): boolean {
  // Regular expression to match email addresses
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email);
}

export function cloakEmail(initialValue: string): string {
  const email = parseOneAddress(initialValue);
  if (
    !validateEmail(initialValue) ||
    !email ||
    !("local" in email) ||
    !("domain" in email)
  ) {
    throw new Error("Invalid email");
  }

  return `${email.local.charAt(0)}...${email.local.charAt(
    email.local.length - 1,
  )}@${email.domain}`;
}

export function convertStringSnake(str) {
  return str.replace(/_/g, " ").toUpperCase();
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
