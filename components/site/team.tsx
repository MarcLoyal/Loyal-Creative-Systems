import Image from "next/image";
import { TEAM, TEAM_PHOTO } from "@/config/content/team";

/** Full team cards for the About page. */
export function TeamGrid() {
  return (
    <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {TEAM.map((m) => (
        <li key={m.photo} className="cut-corners overflow-hidden bg-white ring-1 ring-line">
          <Image
            src={m.photo}
            alt={m.role ? `${m.name}, ${m.role}` : m.name}
            width={TEAM_PHOTO.width}
            height={TEAM_PHOTO.height}
            sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
            className="aspect-[4/5] w-full object-cover"
          />
          <div className="p-6 text-center">
            <h3 className="text-lg">{m.name}</h3>
            {m.role && <p className="mt-1 font-heading text-sm font-semibold text-blue-700">{m.role}</p>}
            {m.focus && <p className="mt-3 text-muted">{m.focus}</p>}
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Small overlapping faces for the contact page. */
export function TeamStrip() {
  return (
    <div className="flex items-center gap-4">
      <ul className="flex -space-x-3" aria-label="Our team">
        {TEAM.map((m) => (
          <li key={m.photo}>
            <Image
              src={m.photo}
              alt={m.name}
              width={TEAM_PHOTO.width}
              height={TEAM_PHOTO.height}
              sizes="56px"
              className="size-14 rounded-full object-cover object-top ring-4 ring-white"
            />
          </li>
        ))}
      </ul>
      <p className="text-muted">Your plan call is with one of us, not a sales rep.</p>
    </div>
  );
}
