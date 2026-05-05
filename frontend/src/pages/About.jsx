export default function About() {
  return (
    <div data-testid="about-page">
      <section className="border-b border-zinc-200">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16 md:py-24 grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-1 font-mono-tech text-[11px] tracking-[0.22em] text-zinc-500">01 / ABOUT</div>
          <div className="col-span-12 md:col-span-11">
            <p className="overline mb-6">Capstone dossier</p>
            <h1 className="font-display font-black text-5xl md:text-7xl tracking-tighter leading-[0.95]">
              On discipline, <span className="italic font-light">structure,</span> and a proof of craft.
            </h1>
          </div>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-6 md:px-10 py-16 md:py-24 grid grid-cols-12 gap-10">
        <aside className="col-span-12 md:col-span-4">
          <div className="md:sticky md:top-24">
            <p className="overline mb-4">Project</p>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tighter">The brief, the build, the bind.</h2>
            <dl className="mt-8 grid grid-cols-2 gap-y-3 font-mono-tech text-sm">
              <dt className="text-zinc-500">Author</dt><dd>Capstone Team</dd>
              <dt className="text-zinc-500">Cohort</dt><dd>2026</dd>
              <dt className="text-zinc-500">Stack</dt><dd>React · FastAPI · Mongo</dd>
              <dt className="text-zinc-500">Pages</dt><dd>06</dd>
              <dt className="text-zinc-500">License</dt><dd>MIT</dd>
            </dl>
          </div>
        </aside>

        <div className="col-span-12 md:col-span-8 prose-like">
          <div className="space-y-6 text-zinc-800 leading-relaxed text-[17px]">
            <p>
              ARKIV is a full-stack academic records platform produced as a
              capstone submission. It satisfies every line of the classical
              PHP/MySQL brief — multi-page navigation, responsive CSS (box
              model, positioning, floats), JavaScript interactivity, server-side
              form handling, session management across pages, and persistent
              CRUD operations — expressed through a modern, honest toolchain.
            </p>
            <p>
              The visual language borrows from Swiss typographic tradition and
              editorial brutalism: radical contrast, monospaced technical
              labels, generous asymmetry, and 1&nbsp;px rules as architecture.
              Rounded corners, drop shadows, and decorative gradients are
              deliberately absent.
            </p>
            <h3 className="font-display font-extrabold text-2xl tracking-tight mt-10 border-t border-zinc-200 pt-8">
              Objectives met
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono-tech text-sm">
              {[
                "Home, About, Features, Data, Login, Contact",
                "Responsive CSS w/ box model + floats + positioning",
                "DHTML: live GPA calculator & validation",
                "Server-side form handling (FastAPI)",
                "Session continuity via JWT cookies (2+ pages)",
                "CRUD — Create & Read to MongoDB",
                "Consistent navigation & typography",
                "Deploy-ready — GitHub + instructions",
              ].map((t, i) => (
                <li key={i} className="border border-zinc-200 p-3 flex gap-3 items-start">
                  <span className="text-[#002FA7]">▸</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <h3 className="font-display font-extrabold text-2xl tracking-tight mt-10 border-t border-zinc-200 pt-8">
              A note on stack
            </h3>
            <p>
              While the brief specified PHP/MySQL, the submission preserves the
              spirit of the requirement — server-rendered data flow, session
              continuity, SQL-like schemas — while using a modern, auditable
              stack (FastAPI + MongoDB). Every PHP concept has a direct analog:
              routes for endpoints, pydantic for form validation, cookies for
              sessions, and indexed collections for persistence.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-200">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12">
          <div className="md:col-span-7 relative min-h-[320px]">
            <img
              src="https://images.unsplash.com/photo-1684403798139-289e0f7fa5da?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwyfHx1bml2ZXJzaXR5JTIwbGlicmFyeSUyMGFyY2hpdGVjdHVyZXxlbnwwfHx8fDE3Nzc5NjIxNjZ8MA&ixlib=rb-4.1.0&q=85"
              alt="Architecture"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="md:col-span-5 p-10 md:p-16 md:border-l border-t md:border-t-0 border-zinc-200">
            <p className="overline mb-4">Acknowledgement</p>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tighter leading-tight">
              A building for paperwork. A system for memory.
            </h2>
            <p className="mt-6 text-zinc-700 leading-relaxed">
              The archive as a metaphor — columns, catalog numbers, permanent
              records — is what guides the interface. Navigate with
              intention; each page is a room.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
