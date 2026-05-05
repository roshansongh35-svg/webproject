import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer data-testid="site-footer" className="border-t border-zinc-200 mt-24">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-12 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-7 h-7 bg-[#09090b] text-white grid place-items-center font-mono-tech text-xs">
              A
            </span>
            <span className="font-display font-extrabold text-lg">ARKIV</span>
          </div>
          <p className="text-zinc-600 max-w-sm leading-relaxed">
            A structured academic records platform. A capstone project
            demonstrating responsive design, CRUD operations, session
            management, and interactive client-side logic.
          </p>
        </div>

        <div className="md:col-span-3">
          <div className="overline mb-4">Navigate</div>
          <ul className="space-y-2 font-mono-tech text-sm">
            <li><Link className="arkiv-link" to="/">Home</Link></li>
            <li><Link className="arkiv-link" to="/about">About</Link></li>
            <li><Link className="arkiv-link" to="/features">Features</Link></li>
            <li><Link className="arkiv-link" to="/data">Data</Link></li>
            <li><Link className="arkiv-link" to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="md:col-span-4">
          <div className="overline mb-4">Meta</div>
          <dl className="grid grid-cols-2 gap-y-2 font-mono-tech text-xs text-zinc-600">
            <dt>Stack</dt><dd className="text-zinc-900">React · FastAPI · Mongo</dd>
            <dt>Archive ID</dt><dd className="text-zinc-900">ARK-CS-{year}</dd>
            <dt>Status</dt><dd className="text-emerald-600">Operational</dd>
            <dt>Version</dt><dd className="text-zinc-900">1.0.0</dd>
          </dl>
        </div>
      </div>
      <div className="border-t border-zinc-200">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 font-mono-tech text-[11px] tracking-[0.18em] uppercase text-zinc-500">
          <span>© {year} ARKIV — Capstone Project</span>
          <span>Built for academic submission</span>
        </div>
      </div>
    </footer>
  );
}
