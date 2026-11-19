// The three roles a user can have
export type Role = "customer" | "vendor" | "admin";

// One option in the "I am a..." picker on the sign up form
export type AccountType = {
  value: Role;
  label: string;
};

// The logged-in user details the navbar needs
export type NavbarUser = {
  name: string;
  role: Role;
};
