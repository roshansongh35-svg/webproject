import { useState } from "react";
import { api, formatApiErrorDetail } from "@/lib/api";
import { PaperPlaneTilt, At, Phone, MapPin } from "@phosphor-icons/react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [serverErr, setServerErr] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  const validate = () => {
    const e = {};
    if (!form.name || form.name.trim().length < 2) e.name = "Enter your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.subject || form.subject.trim().length < 2) e.subject = "Subject required";
    if (!form.message || form.message.trim().length < 5) e.message = "Message is too short";
    return e;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    setServerErr("");
    setSuccess(false);
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      setShakeKey((k) => k + 1);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await api.post("/contact", { ...form, email: form.email.toLowerCase() });
      setSuccess(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (e) {
      setServerErr(formatApiErrorDetail(e.response?.data?.detail) || e.message);
    } finally {
      setLoading(false);
    }
  };

  const change = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  return (
    <div data-testid="contact-page">
      <section className="border-b border-zinc-200">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16 md:py-24 grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-1 font-mono-tech text-[11px] tracking-[0.22em] text-zinc-500">05 / CONTACT</div>
          <div className="col-span-12 md:col-span-11">
            <p className="overline mb-6">Line open</p>
            <h1 className="font-display font-black text-6xl sm:text-8xl lg:text-[9rem] tracking-tighter leading-[0.88]">
              Let&apos;s <br />
              <span className="italic font-light">talk.</span>
            </h1>
          </div>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-6 md:px-10 py-16 grid grid-cols-12 gap-10">
        <div className="col-span-12 md:col-span-5">
          <p className="overline mb-4">Coordinates</p>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tighter">For questions, demos, or review.</h2>
          <p className="mt-4 text-zinc-600 leading-relaxed max-w-md">
            We answer every message. This form writes directly to the archive
            database — the same persistence layer that powers the records page.
          </p>

          <ul className="mt-10 space-y-5 font-mono-tech text-sm">
            <li className="flex items-center gap-3"><At size={16} /> <span>hello@arkiv.edu</span></li>
            <li className="flex items-center gap-3"><Phone size={16} /> <span>+91 · 0000 000 000</span></li>
            <li className="flex items-center gap-3"><MapPin size={16} /> <span>Department of CS · Capstone Lab</span></li>
          </ul>
        </div>

        <div className="col-span-12 md:col-span-7">
          <form onSubmit={submit} key={shakeKey} className={`border border-zinc-200 p-6 md:p-10 ${Object.keys(errors).length ? "shake" : ""}`} data-testid="contact-form">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="arkiv-label">Name</label>
                <input
                  data-testid="contact-name"
                  className="arkiv-input"
                  value={form.name}
                  onChange={(e) => change("name", e.target.value)}
                />
                {errors.name && <p className="mt-1 text-xs text-[#FF2400] font-mono-tech">{errors.name}</p>}
              </div>
              <div>
                <label className="arkiv-label">Email</label>
                <input
                  data-testid="contact-email"
                  type="email"
                  className="arkiv-input"
                  value={form.email}
                  onChange={(e) => change("email", e.target.value)}
                />
                {errors.email && <p className="mt-1 text-xs text-[#FF2400] font-mono-tech">{errors.email}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="arkiv-label">Subject</label>
                <input
                  data-testid="contact-subject"
                  className="arkiv-input"
                  value={form.subject}
                  onChange={(e) => change("subject", e.target.value)}
                />
                {errors.subject && <p className="mt-1 text-xs text-[#FF2400] font-mono-tech">{errors.subject}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="arkiv-label">Message</label>
                <textarea
                  data-testid="contact-message"
                  rows={6}
                  className="arkiv-input"
                  value={form.message}
                  onChange={(e) => change("message", e.target.value)}
                />
                {errors.message && <p className="mt-1 text-xs text-[#FF2400] font-mono-tech">{errors.message}</p>}
              </div>
            </div>

            {serverErr && <p data-testid="contact-err" className="mt-4 text-sm text-[#FF2400] font-mono-tech">{serverErr}</p>}
            {success && (
              <p data-testid="contact-success" className="mt-4 text-sm text-emerald-600 font-mono-tech">
                Message received. We will be in touch.
              </p>
            )}

            <div className="mt-6 flex justify-end">
              <button type="submit" disabled={loading} className="arkiv-btn" data-testid="contact-submit">
                {loading ? "Sending…" : (<>Send message <PaperPlaneTilt size={14} weight="bold" /></>)}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
