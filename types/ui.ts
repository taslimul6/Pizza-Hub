// Props for shared UI components

export type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  center?: boolean; // center the text (default: left aligned)
  light?: boolean; // use light text colors (for dark backgrounds)
};

export type GoogleButtonProps = {
  label: string; // Button text, e.g. "Sign in with Google"
  role?: string; // Account type for brand-new users (signup page only)
};
