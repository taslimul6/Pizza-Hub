// Password rules for every sign up form (checked in the browser and on the server):
// at least 8 characters, with one uppercase letter, one lowercase letter,
// one number and one special character.
// Only new sign ups are checked. Sign in does not use these rules, so old accounts still work.
export const PASSWORD_MIN_LENGTH = 8;

// Hint text shown under the password field
export const PASSWORD_HINT =
  "At least 8 characters with an uppercase letter, a lowercase letter, a number and a special character.";

// Returns a message when the password breaks a rule, or null when it is fine
export function checkPassword(password: string): string | null {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
  }
  if (!/[A-Z]/.test(password)) return "Password needs at least one uppercase letter.";
  if (!/[a-z]/.test(password)) return "Password needs at least one lowercase letter.";
  if (!/[0-9]/.test(password)) return "Password needs at least one number.";
  if (!/[^A-Za-z0-9]/.test(password)) return "Password needs at least one special character.";
  return null;
}
