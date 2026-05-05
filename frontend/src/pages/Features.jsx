import { Link } from "react-router-dom";
import {
  Layout as LayoutIcon,
  Lock,
  Calculator,
  Database,
  Envelope,
  DeviceMobile,
  Code,
  StackSimple,
  ArrowUpRight,
} from "@phosphor-icons/react";

const features = [
  {
    n: "01",
    icon: LayoutIcon,
    title: "Six-page architecture",
    body: "Home, About, Features, Data, Login, Contact — a consistent shell, each page wearing its own discipline.",
  },
  {
    n: "02",
    icon: DeviceMobile,
    title: "Responsive CSS",
    body: "Box model, positioning, and floats applied across breakpoints. Mobile-first grids rebuild as columns.",
  },
  {
    n: "03",
    icon: Calculator,
    title: "DHTML calculator",
    body: "A live, client-side GPA calculator. Rows can be added and removed; result reflows without a reload.",
  },
  {
    n: "04",
    icon: Code,
    title: "Form validation",
    body: "Inline validation with friendly errors and shake feedback. Server-side validation mirrors the client.",
  },
  {
    n: "05",
    icon: Lock,
    title: "Sessions across pages",
    body: "JWT tokens stored in HTTP-only cookies. Cookie auth persists across Login → Data → Contact.",
  },
  {
    n: "06",
    icon: Database,
    title: "CRUD — Create & Read",
    body: "Records are submitted to the database and read back live into the dashboard table.",
  },
  {
    n: "07",
    icon: Envelope,
    title: "Contact intake",
    body: "Public contact form stores messages with timestamps — a second persistence channel.",
  },
  {
    n: "08",
    icon: StackSimple,
    title: "Deploy-ready",
    body: "Source structured for GitHub. Includes deployment notes for modern static + API hosts.",
  },
];

export default function Features() {
  return (
    <div data-testid="features-page">
      <section className="border-b border-zinc-200">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16 md:py-24 grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-1 font-mono-tech text-[11px] tracking-[0.22em] text-zinc-500">02 / FEATURES</div>
          <div className="col-span-12 md:col-span-11">
            <p className="overline mb-6">Capability index</p>
            <h1 className="font-display font-black text-5xl md:text-7xl tracking-tighter leading-[0.95]">
              Eight tight disciplines.
              <br />
              <span className="italic font-light">One coherent system.</span>
            </h1>
          </div>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-zinc-200">
          {features.map((f, i) => {
            const Icon = f.icon;
            const borderR = (i % 4) !== 3 ? "md:border-r" : "";
            const borderR2 = (i % 2) !== 1 ? "border-r" : "";
            return (
              <div
                key={f.n}
                data-testid={`feature-${f.n}`}
                className={`group p-8 lg:p-10 border-b border-zinc-200 ${borderR2} md:border-r-0 ${borderR} border-zinc-200 transition-colors duration-150 hover:bg-zinc-50`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono-tech text-xs tracking-[0.2em] text-zinc-400">{f.n}</span>
                  <Icon size={22} weight="duotone" />
                </div>
                <h3 className="font-display font-extrabold text-2xl tracking-tight mt-6 leading-tight">
                  {f.title}
                </h3>
                <p className="text-zinc-600 mt-3 text-sm leading-relaxed">{f.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-6 md:px-10 py-20">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-4">
            <p className="overline mb-4">03 / Cross-reference</p>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tighter leading-[0.95]">
              Every feature mapped to the brief.
            </h2>
          </div>
          <div className="col-span-12 md:col-span-8 border border-zinc-200">
            {[
              ["Requirement", "Implementation"],
              ["Min. 6 pages", "Home · About · Features · Data · Login · Contact"],
              ["Responsive CSS", "Tailwind grid / flexbox / position / float"],
              ["JS / DHTML", "GPA calculator · live validation"],
              ["Server-side forms", "FastAPI endpoints (register, login, records, contact)"],
              ["Sessions / Cookies", "JWT in HTTP-only cookies · 12-hour lifetime"],
              ["CRUD", "Mongo collection — Create & Read records"],
              ["Deployment", "GitHub-ready · API + static hosts"],
            ].map(([k, v], idx, arr) => (
              <div
                key={k}
                className={`grid grid-cols-12 ${idx < arr.length - 1 ? "border-b" : ""} border-zinc-200 text-sm`}
              >
                <div className={`col-span-12 md:col-span-4 p-4 font-mono-tech text-xs tracking-[0.18em] uppercase ${idx === 0 ? "bg-zinc-100 text-zinc-900" : "text-zinc-500"}`}>
                  {k}
                </div>
                <div className={`col-span-12 md:col-span-8 p-4 ${idx === 0 ? "bg-zinc-100 font-mono-tech text-xs tracking-[0.18em] uppercase" : ""}`}>
                  {v}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-200">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16 flex flex-wrap items-center justify-between gap-6">
          <h3 className="font-display font-extrabold text-3xl md:text-5xl tracking-tighter">Try the dashboard.</h3>
          <Link to="/data" className="arkiv-btn" data-testid="features-cta">
            Go to Data <ArrowUpRight size={14} weight="bold" />
          </Link>
        </div>
      </section>
    </div>
  );
}
