// A single link (navbar, footer)
export type NavLink = {
  href: string;
  label: string;
};

// A titled group of links in the footer
export type FooterColumn = {
  title: string;
  links: NavLink[];
};
