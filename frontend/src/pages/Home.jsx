import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowUpRight, ArrowRight, Database, ShieldCheck, Calculator } from "@phosphor-icons/react";
import { api } from "@/lib/api";

export default function Home() {
  const [stats, setStats] = useState({ total_users: 0, total_records: 0, avg_gpa: 0, total_messages: 0 });
  const [preview, setPreview] = useState([]);

  useEffect(() => {
    api.get("/stats").then((r) => setStats(r.data)).catch(() => {});
    api.get("/records/public").then((r) => setPreview(r.data || [])).catch(() => {});
  }, []);

  return (
    <div data-testid="home-page">
      {/* Ticker */}
      <div className="border-b border-zinc-200 overflow-hidden">
        <div className="flex whitespace-nowrap py-2 ticker font-mono-tech text-[11px] tracking-[0.22em] uppercase text-zinc-500">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-12 px-6">
              <span>★ Capstone 2026</span>
              <span>· Swiss Archive System</span>
              <span>· CRUD / Sessions / DHTML</span>
              <span>· Records : {stats.total_records}</span>
              <span>· Users : {stats.total_users}</span>
              <span>· Avg GPA : {stats.avg_gpa}</span>
              <span>· v1.0.0</span>
            </div>
          ))}
        </div>
      </div>

      {/* Hero — asymmetric tetris */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-10 pt-16 md:pt-24 pb-16">
        <div className="grid grid-cols-12 gap-6 md:gap-8">
          <div className="col-span-12 md:col-span-1 font-mono-tech text-[11px] tracking-[0.22em] text-zinc-500">
            01 / HERO
          </div>
          <div className="col-span-12 md:col-span-11">
            <p className="overline fade-up mb-6">Academic Records · Capstone 2026</p>
            <h1 className="font-display font-black text-5xl sm:text-7xl lg:text-[7.5rem] leading-[0.92] tracking-tighter fade-up d1">
              A <span className="italic font-light">structured</span>
              <br />
              archive for
              <br />
              academic data.
            </h1>
            <div className="mt-10 grid grid-cols-12 gap-6 fade-up d2">
              <p className="col-span-12 md:col-span-6 text-zinc-700 leading-relaxed text-lg">
                ARKIV is a capstone-grade, multi-page web application
                demonstrating responsive design, session management, CRUD
                persistence, and live client-side computation. Zero ornament,
                maximum legibility.
              </p>
              <div className="col-span-12 md:col-span-3 flex md:justify-end items-end">
                <Link to="/data" data-testid="home-cta-data" className="arkiv-btn w-full md:w-auto">
                  Enter the Archive
                  <ArrowUpRight size={14} weight="bold" />
                </Link>
              </div>
              <div className="col-span-12 md:col-span-3 flex md:justify-end items-end">
                <Link to="/features" data-testid="home-cta-features" className="arkiv-btn arkiv-btn-outline w-full md:w-auto">
                  See Features
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KPI / Stats row with 1px grid */}
      <section className="border-y border-zinc-200">
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4">
          {[
            { label: "Registered Users", value: stats.total_users },
            { label: "Archived Records", value: stats.total_records },
            { label: "Avg. GPA", value: stats.avg_gpa },
            { label: "Uptime", value: "99.9%" },
          ].map((s, i) => (
            <div
              key={i}
              className={`p-6 md:p-10 ${i < 3 ? "md:border-r" : ""} border-zinc-200 ${i < 2 ? "border-b md:border-b-0" : ""}`}
              data-testid={`home-stat-${i}`}
            >
              <div className="overline mb-4">{String(i + 1).padStart(2, "0")} / {s.label}</div>
              <div className="font-display font-extrabold text-4xl md:text-6xl tracking-tighter">
                {s.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tetris feature preview */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-10 py-20">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-5">
            <p className="overline mb-4">02 / Capabilities</p>
            <h2 className="font-display font-extrabold text-4xl md:text-5xl tracking-tighter leading-[0.95]">
              Six pages.
              <br />
              One coherent system.
            </h2>
            <p className="mt-6 text-zinc-700 leading-relaxed max-w-md">
              Every requirement from the brief is mapped to a discipline: data
              to the dashboard, logic to the calculator, trust to the login,
              continuity to the session.
            </p>
          </div>
          <div className="col-span-12 md:col-span-7 grid grid-cols-2 border border-zinc-200">
            <div className="p-6 border-r border-b border-zinc-200">
              <Database size={22} weight="duotone" />
              <div className="overline mt-4">CRUD</div>
              <h3 className="font-display font-bold text-xl mt-2">Create & Read</h3>
              <p className="text-sm text-zinc-600 mt-2">Persist records to MongoDB, read them back in a live table.</p>
            </div>
            <div className="p-6 border-b border-zinc-200">
              <ShieldCheck size={22} weight="duotone" />
              <div className="overline mt-4">Sessions</div>
              <h3 className="font-display font-bold text-xl mt-2">JWT Cookies</h3>
              <p className="text-sm text-zinc-600 mt-2">HTTP-only auth across every protected page and request.</p>
            </div>
            <div className="p-6 border-r border-zinc-200">
              <Calculator size={22} weight="duotone" />
              <div className="overline mt-4">DHTML</div>
              <h3 className="font-display font-bold text-xl mt-2">GPA Calculator</h3>
              <p className="text-sm text-zinc-600 mt-2">Interactive, client-side computation with zero reloads.</p>
            </div>
            <div className="p-6">
              <ArrowRight size={22} weight="bold" />
              <div className="overline mt-4">Responsive</div>
              <h3 className="font-display font-bold text-xl mt-2">Grid + Flow</h3>
              <p className="text-sm text-zinc-600 mt-2">Box model, positioning, and floats rendered mobile-first.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Hero image split */}
      <section className="border-y border-zinc-200">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12">
          <div className="md:col-span-6 p-8 md:p-14 md:border-r border-zinc-200 order-2 md:order-1">
            <p className="overline mb-4">03 / Library</p>
            <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tighter leading-[0.95]">
              Where every
              <br />
              student record lives.
            </h2>
            <p className="mt-6 text-zinc-700 leading-relaxed max-w-md">
              Like a physical archive — catalogued, cross-referenced, and preserved — ARKIV stores every submission with timestamp and author.
            </p>
            <div className="mt-8 flex gap-3">
              <Link to="/login" className="arkiv-btn" data-testid="home-login-cta">Login</Link>
              <Link to="/about" className="arkiv-btn arkiv-btn-outline" data-testid="home-about-cta">Read About</Link>
            </div>
          </div>
          <div className="md:col-span-6 relative order-1 md:order-2 min-h-[340px] md:min-h-[460px]">
            <img
              src="https://images.pexels.com/photos/33750807/pexels-photo-33750807.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
              alt="Library"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/0 to-transparent md:hidden" />
          </div>
        </div>
      </section>

      {/* Preview table (public snippet) */}
      {preview.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-6 md:px-10 py-20">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
            <div>
              <p className="overline mb-2">04 / Recent Archives</p>
              <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tighter">Latest 10 Entries</h2>
            </div>
            <Link to="/data" className="arkiv-btn arkiv-btn-outline" data-testid="home-view-all">View all</Link>
          </div>
          <div className="border border-zinc-200">
            <div className="hidden md:grid grid-cols-12 font-mono-tech text-[11px] tracking-[0.18em] uppercase text-zinc-500 border-b border-zinc-200">
              <div className="col-span-1 p-4">#</div>
              <div className="col-span-3 p-4">Student</div>
              <div className="col-span-2 p-4">ID</div>
              <div className="col-span-3 p-4">Course</div>
              <div className="col-span-1 p-4">Sem</div>
              <div className="col-span-1 p-4">GPA</div>
              <div className="col-span-1 p-4">By</div>
            </div>
            {preview.map((r, i) => (
              <div key={r.id} className={`grid grid-cols-2 md:grid-cols-12 text-sm ${i < preview.length - 1 ? "border-b border-zinc-200" : ""}`}>
                <div className="col-span-1 p-4 font-mono-tech text-zinc-500 hidden md:block">{String(i + 1).padStart(2, "0")}</div>
                <div className="col-span-2 md:col-span-3 p-4 font-medium">{r.student_name}</div>
                <div className="col-span-2 p-4 font-mono-tech text-zinc-600">{r.student_id}</div>
                <div className="col-span-2 md:col-span-3 p-4">{r.course}</div>
                <div className="col-span-1 p-4 font-mono-tech">{r.semester}</div>
                <div className="col-span-1 p-4 font-mono-tech text-[#002FA7]">{r.gpa}</div>
                <div className="col-span-1 p-4 text-zinc-500 text-xs truncate">{r.created_by_name}</div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
