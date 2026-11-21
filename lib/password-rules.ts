// Password rules for every sign up form (checked in the browser and on the server):
// at least 6 characters, one uppercase letter and one lowercase letter.
export const PASSWORD_MIN_LENGTH = 6;

// Returns a message when the password breaks a rule, or null when it is fine
export function checkPassword(password: string): string | null {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
  }
  if (!/[A-Z]/.test(password)) return "Password needs at least one uppercase letter.";
  if (!/[a-z]/.test(password)) return "Password needs at least one lowercase letter.";
  return null;
}
