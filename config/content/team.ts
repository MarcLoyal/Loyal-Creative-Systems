/**
 * Team members shown on the About page and the contact page (SPEC 6.8).
 *
 * [DECISION] D7: names confirmed; roles and focus lines still to come. A card
 * shows only the fields that are filled in.
 * Photos are 800 × 1000 (4:5) WebP in /public/team, named after the person, with metadata stripped.
 * Only publish a photo with that person's consent.
 */
export type TeamMember = {
  name: string;
  role?: string;
  /** One line on what this person handles for clients. */
  focus?: string;
  photo: string;
};

export const TEAM_PHOTO = { width: 800, height: 1000 } as const;

export const TEAM: TeamMember[] = [
  {
    name: "Richter Castillo",
    photo: "/team/richter-castillo.webp",
  },
  {
    name: "Jomari Ramos",
    photo: "/team/jomari-ramos.webp",
  },
  {
    name: "Marc Neil Abanador",
    photo: "/team/marc-neil-abanador.webp",
  },
];
