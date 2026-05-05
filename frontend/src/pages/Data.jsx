import { useEffect, useState } from "react";
import { api, formatApiErrorDetail } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Plus, Trash, Calculator, FloppyDisk, MagnifyingGlass } from "@phosphor-icons/react";

function validateRecord(values) {
  const e = {};
  if (!values.student_name || values.student_name.trim().length < 2) e.student_name = "Name too short";
  if (!values.student_id || values.student_id.trim().length < 2) e.student_id = "Required";
  if (!values.course || values.course.trim().length < 1) e.course = "Required";
  if (!values.semester) e.semester = "Required";
  const gpaNum = parseFloat(values.gpa);
  if (isNaN(gpaNum) || gpaNum < 0 || gpaNum > 4) e.gpa = "GPA must be 0.00 – 4.00";
  return e;
}

export default function Data() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [serverErr, setServerErr] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [query, setQuery] = useState("");
  const [stats, setStats] = useState({ total_users: 0, total_records: 0, avg_gpa: 0, total_messages: 0 });

  const [form, setForm] = useState({
    student_name: "",
    student_id: "",
    course: "",
    semester: "1",
    gpa: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [shakeKey, setShakeKey] = useState(0);

  // Calculator rows
  const [calcRows, setCalcRows] = useState([
    { id: crypto.randomUUID(), course: "Algorithms", credits: 3, grade: "A" },
    { id: crypto.randomUUID(), course: "Databases", credits: 3, grade: "A-" },
    { id: crypto.randomUUID(), course: "Web Dev", credits: 4, grade: "B+" },
  ]);

  const gradeToPoints = {
    "A+": 4.0, A: 4.0, "A-": 3.7,
    "B+": 3.3, B: 3.0, "B-": 2.7,
    "C+": 2.3, C: 2.0, "C-": 1.7,
    "D+": 1.3, D: 1.0, F: 0.0,
  };

  const totals = calcRows.reduce(
    (acc, r) => {
      const credits = Number(r.credits) || 0;
      const points = (gradeToPoints[r.grade] ?? 0) * credits;
      acc.credits += credits;
      acc.points += points;
      return acc;
    },
    { credits: 0, points: 0 }
  );
  const computedGpa = totals.credits > 0 ? (totals.points / totals.credits).toFixed(2) : "—";

  const fetchRecords = async () => {
    try {
      const { data } = await api.get("/records");
      setRecords(data);
    } catch (e) {
      setServerErr(formatApiErrorDetail(e.response?.data?.detail) || e.message);
    }
  };
  const fetchStats = async () => {
    try {
      const { data } = await api.get("/stats");
      setStats(data);
    } catch {}
  };

  useEffect(() => {
    fetchRecords();
    fetchStats();
  }, []);

  const handleChange = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const submit = async (ev) => {
    ev.preventDefault();
    setServerErr("");
    setSuccessMsg("");
    const errs = validateRecord(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      setShakeKey((k) => k + 1);
      return;
    }
    setLoading(true);
    try {
      const payload = { ...form, gpa: parseFloat(form.gpa) };
      await api.post("/records", payload);
      setSuccessMsg("Record archived.");
      setForm({ student_name: "", student_id: "", course: "", semester: "1", gpa: "", notes: "" });
      fetchRecords();
      fetchStats();
    } catch (e) {
      setServerErr(formatApiErrorDetail(e.response?.data?.detail) || e.message);
    } finally {
      setLoading(false);
    }
  };

  const addCalcRow = () =>
    setCalcRows((rows) => [...rows, { id: crypto.randomUUID(), course: "", credits: 3, grade: "A" }]);
  const delCalcRow = (id) => setCalcRows((rows) => rows.filter((r) => r.id !== id));
  const updCalc = (id, k, v) =>
    setCalcRows((rows) => rows.map((r) => (r.id === id ? { ...r, [k]: v } : r)));

  const useCalcInForm = () => {
    if (computedGpa === "—") return;
    setForm((f) => ({ ...f, gpa: computedGpa }));
  };

  const filtered = records.filter(
    (r) =>
      !query ||
      r.student_name.toLowerCase().includes(query.toLowerCase()) ||
      r.student_id.toLowerCase().includes(query.toLowerCase()) ||
      r.course.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div data-testid="data-page">
      {/* Header */}
      <section className="border-b border-zinc-200">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-10 md:py-14 grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-1 font-mono-tech text-[11px] tracking-[0.22em] text-zinc-500">03 / DATA</div>
          <div className="col-span-12 md:col-span-11">
            <p className="overline mb-4">Control room · Session active</p>
            <h1 className="font-display font-black text-4xl md:text-6xl tracking-tighter leading-[0.95]">
              Dashboard.
            </h1>
            <p className="mt-4 text-zinc-600">Signed in as <span className="font-mono-tech">{user?.email}</span></p>
          </div>
        </div>
      </section>

      {/* KPI row */}
      <section className="border-b border-zinc-200">
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4">
          {[
            ["Users", stats.total_users],
            ["Records", stats.total_records],
            ["Avg GPA", stats.avg_gpa],
            ["Messages", stats.total_messages],
          ].map(([label, value], i) => (
            <div
              key={label}
              className={`p-6 md:p-8 ${i < 3 ? "md:border-r" : ""} border-zinc-200 ${i < 2 ? "border-b md:border-b-0" : ""}`}
              data-testid={`kpi-${label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <div className="overline mb-3">{label}</div>
              <div className="font-display font-extrabold text-3xl md:text-5xl tracking-tighter">
                {value}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Form + Calculator row */}
      <section className="max-w-[1400px] mx-auto border-b border-zinc-200 grid grid-cols-1 lg:grid-cols-12">
        {/* CRUD Form */}
        <div className="lg:col-span-4 p-6 md:p-10 lg:border-r border-zinc-200">
          <div className="flex items-center justify-between mb-6">
            <p className="overline">Create Record</p>
            <span className="font-mono-tech text-[10px] tracking-[0.2em] text-zinc-400">POST /api/records</span>
          </div>
          <form onSubmit={submit} key={shakeKey} className={Object.keys(errors).length ? "shake" : ""} data-testid="record-form">
            <div className="space-y-5">
              <div>
                <label className="arkiv-label">Student Name</label>
                <input
                  data-testid="record-student-name"
                  className="arkiv-input"
                  placeholder="e.g. Ada Lovelace"
                  value={form.student_name}
                  onChange={(e) => handleChange("student_name", e.target.value)}
                />
                {errors.student_name && <p className="mt-1 text-xs text-[#FF2400] font-mono-tech">{errors.student_name}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="arkiv-label">Student ID</label>
                  <input
                    data-testid="record-student-id"
                    className="arkiv-input"
                    placeholder="STU-001"
                    value={form.student_id}
                    onChange={(e) => handleChange("student_id", e.target.value)}
                  />
                  {errors.student_id && <p className="mt-1 text-xs text-[#FF2400] font-mono-tech">{errors.student_id}</p>}
                </div>
                <div>
                  <label className="arkiv-label">Semester</label>
                  <select
                    data-testid="record-semester"
                    className="arkiv-input"
                    value={form.semester}
                    onChange={(e) => handleChange("semester", e.target.value)}
                  >
                    {["1", "2", "3", "4", "5", "6", "7", "8"].map((s) => (
                      <option key={s} value={s}>Sem {s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="arkiv-label">Course</label>
                <input
                  data-testid="record-course"
                  className="arkiv-input"
                  placeholder="e.g. Data Structures"
                  value={form.course}
                  onChange={(e) => handleChange("course", e.target.value)}
                />
                {errors.course && <p className="mt-1 text-xs text-[#FF2400] font-mono-tech">{errors.course}</p>}
              </div>
              <div>
                <label className="arkiv-label">GPA (0.00 – 4.00)</label>
                <input
                  data-testid="record-gpa"
                  className="arkiv-input"
                  inputMode="decimal"
                  placeholder="3.75"
                  value={form.gpa}
                  onChange={(e) => handleChange("gpa", e.target.value)}
                />
                {errors.gpa && <p className="mt-1 text-xs text-[#FF2400] font-mono-tech">{errors.gpa}</p>}
              </div>
              <div>
                <label className="arkiv-label">Notes (optional)</label>
                <textarea
                  data-testid="record-notes"
                  className="arkiv-input"
                  rows={3}
                  placeholder="Remarks, honours, etc."
                  value={form.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                />
              </div>

              {serverErr && <p data-testid="record-server-err" className="text-sm text-[#FF2400] font-mono-tech">{serverErr}</p>}
              {successMsg && <p data-testid="record-success" className="text-sm text-emerald-600 font-mono-tech">{successMsg}</p>}

              <button type="submit" disabled={loading} className="arkiv-btn w-full" data-testid="record-submit">
                {loading ? "Archiving…" : (<><FloppyDisk size={14} weight="bold" /> Archive Record</>)}
              </button>
            </div>
          </form>
        </div>

        {/* GPA Calculator */}
        <div className="lg:col-span-8 p-6 md:p-10">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <p className="overline mb-1">Interactive GPA Calculator · DHTML</p>
              <h2 className="font-display font-extrabold text-2xl md:text-3xl tracking-tight">Live computation</h2>
            </div>
            <button type="button" onClick={useCalcInForm} className="arkiv-btn arkiv-btn-outline" data-testid="calc-use-gpa">
              Use in form →
            </button>
          </div>

          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 md:col-span-8">
              <div className="border border-zinc-200">
                <div className="grid grid-cols-12 border-b border-zinc-200 font-mono-tech text-[11px] tracking-[0.18em] uppercase text-zinc-500">
                  <div className="col-span-6 p-3">Course</div>
                  <div className="col-span-3 p-3">Credits</div>
                  <div className="col-span-2 p-3">Grade</div>
                  <div className="col-span-1 p-3"></div>
                </div>
                {calcRows.map((r, i) => (
                  <div key={r.id} className={`grid grid-cols-12 items-center ${i < calcRows.length - 1 ? "border-b" : ""} border-zinc-200`}>
                    <input
                      data-testid={`calc-course-${i}`}
                      className="col-span-6 p-3 outline-none font-mono-tech text-sm bg-transparent"
                      placeholder="Course name"
                      value={r.course}
                      onChange={(e) => updCalc(r.id, "course", e.target.value)}
                    />
                    <input
                      data-testid={`calc-credits-${i}`}
                      type="number"
                      min={0}
                      max={10}
                      className="col-span-3 p-3 outline-none font-mono-tech text-sm bg-transparent border-l border-zinc-200"
                      value={r.credits}
                      onChange={(e) => updCalc(r.id, "credits", e.target.value)}
                    />
                    <select
                      data-testid={`calc-grade-${i}`}
                      className="col-span-2 p-3 outline-none font-mono-tech text-sm bg-transparent border-l border-zinc-200"
                      value={r.grade}
                      onChange={(e) => updCalc(r.id, "grade", e.target.value)}
                    >
                      {Object.keys(gradeToPoints).map((g) => (<option key={g} value={g}>{g}</option>))}
                    </select>
                    <button
                      type="button"
                      onClick={() => delCalcRow(r.id)}
                      data-testid={`calc-del-${i}`}
                      className="col-span-1 p-3 text-zinc-400 hover:text-[#FF2400] border-l border-zinc-200"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addCalcRow}
                data-testid="calc-add-row"
                className="mt-4 arkiv-btn arkiv-btn-outline"
              >
                <Plus size={14} weight="bold" /> Add course
              </button>
            </div>
            <div className="col-span-12 md:col-span-4">
              <div className="border border-zinc-200 p-6 h-full flex flex-col justify-between">
                <div>
                  <div className="overline mb-2">Computed</div>
                  <div className="font-display font-black text-7xl tracking-tighter text-[#002FA7]" data-testid="calc-gpa-value">
                    {computedGpa}
                  </div>
                  <div className="font-mono-tech text-xs text-zinc-500 mt-2">GPA · 4.00 scale</div>
                </div>
                <dl className="mt-6 grid grid-cols-2 gap-y-1 font-mono-tech text-xs">
                  <dt className="text-zinc-500">Credits</dt><dd>{totals.credits}</dd>
                  <dt className="text-zinc-500">Points</dt><dd>{totals.points.toFixed(2)}</dd>
                  <dt className="text-zinc-500">Courses</dt><dd>{calcRows.length}</dd>
                </dl>
                <div className="flex items-center gap-2 text-zinc-500 mt-6">
                  <Calculator size={14} />
                  <span className="font-mono-tech text-[10px] tracking-[0.18em] uppercase">Client-side · no reload</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Records table */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-10 py-10 md:py-14">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
          <div>
            <p className="overline mb-2">Archive · Read</p>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tighter">Records ({filtered.length})</h2>
          </div>
          <div className="relative">
            <MagnifyingGlass size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              data-testid="records-search"
              className="arkiv-input pl-9 w-full md:w-72"
              placeholder="Search name, ID, course"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="border border-zinc-200">
          <div className="hidden md:grid grid-cols-12 font-mono-tech text-[11px] tracking-[0.18em] uppercase text-zinc-500 border-b border-zinc-200 bg-zinc-50">
            <div className="col-span-1 p-4">#</div>
            <div className="col-span-2 p-4">Student</div>
            <div className="col-span-1 p-4">ID</div>
            <div className="col-span-2 p-4">Course</div>
            <div className="col-span-1 p-4">Sem</div>
            <div className="col-span-1 p-4">GPA</div>
            <div className="col-span-2 p-4">Notes</div>
            <div className="col-span-2 p-4">By · At</div>
          </div>
          {filtered.length === 0 ? (
            <div className="p-10 text-center text-zinc-500 font-mono-tech text-sm" data-testid="records-empty">
              No records yet — create your first one on the left.
            </div>
          ) : (
            filtered.map((r, i) => (
              <div
                key={r.id}
                className={`grid grid-cols-2 md:grid-cols-12 text-sm ${i < filtered.length - 1 ? "border-b border-zinc-200" : ""} hover:bg-zinc-50`}
                data-testid={`record-row-${i}`}
              >
                <div className="hidden md:block col-span-1 p-4 font-mono-tech text-zinc-500">{String(i + 1).padStart(2, "0")}</div>
                <div className="col-span-2 p-4 font-medium">{r.student_name}</div>
                <div className="col-span-1 p-4 font-mono-tech text-zinc-600">{r.student_id}</div>
                <div className="col-span-2 p-4">{r.course}</div>
                <div className="col-span-1 p-4 font-mono-tech">{r.semester}</div>
                <div className="col-span-1 p-4 font-mono-tech text-[#002FA7]">{r.gpa}</div>
                <div className="col-span-2 p-4 text-zinc-600 text-xs truncate">{r.notes || "—"}</div>
                <div className="col-span-2 p-4 font-mono-tech text-[11px] text-zinc-500">
                  {r.created_by_name}
                  <br />
                  {new Date(r.created_at).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
