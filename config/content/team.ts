/**
 * Team members shown on the About page and the contact page (SPEC 6.8).
 *
 * [DECISION] D7: names and roles are placeholders until the owner confirms them.
 * Photos are 800 × 1000 (4:5) WebP in /public/team, with metadata stripped.
 * Only publish a photo with that person's consent.
 */
export type TeamMember = {
  name: string;
  role: string;
  /** One line on what this person handles for clients. */
  focus: string;
  photo: string;
};

export const TEAM_PHOTO = { width: 800, height: 1000 } as const;

export const TEAM: TeamMember[] = [
  {
    name: "Team member name",
    role: "Role to confirm",
    focus: "What this person handles for clients.",
    photo: "/team/member-1.webp",
  },
  {
    name: "Team member name",
    role: "Role to confirm",
    focus: "What this person handles for clients.",
    photo: "/team/member-2.webp",
  },
  {
    name: "Team member name",
    role: "Role to confirm",
    focus: "What this person handles for clients.",
    photo: "/team/member-3.webp",
  },
];
