"use client";

import { ChangeEvent, DragEvent, useState } from "react";
import Link from "next/link";

const steps = [
  "Account & profile",
  "Identity & KYC",
  "Biometric liveness",
  "Business & tax",
  "Payout rails",
];

const documents = [
  { name: "Driver’s License", detail: "State-issued digital card", mark: "▣" },
  { name: "Passport", detail: "Global travel document", mark: "▤" },
  { name: "National ID Card", detail: "Government identity card", mark: "▣" },
];

function Check() {
  return <span aria-hidden="true" className="text-emerald-600">✓</span>;
}

export default function SellerOnboardingPage() {
  const [activeStep, setActiveStep] = useState(1);
  const [document, setDocument] = useState(documents[0].name);
  const [files, setFiles] = useState<string[]>(["front_license_scan.jpg", "back_license_scan.jpg"]);
  const [dragging, setDragging] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [message, setMessage] = useState("");

  const addFiles = (selected: FileList | null) => {
    if (!selected?.length) return;
    setFiles((current) => [...current, ...Array.from(selected).map((file) => file.name)]);
    setMessage(`${selected.length} file${selected.length === 1 ? "" : "s"} added to this session.`);
  };

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    addFiles(event.target.files);
    event.target.value = "";
  };

  const onDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragging(false);
    addFiles(event.dataTransfer.files);
  };

  const continueStep = () => {
    setActiveStep((current) => Math.min(current + 1, steps.length - 1));
    setMessage("Progress updated in this browser session. Your information has not been submitted.");
  };

  return (
    <main className="min-h-screen bg-[#f7f6fc] text-slate-900">
      <header className="sticky top-0 z-30 border-b border-violet-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-3 sm:px-7">
          <div className="flex items-center gap-5">
            <Link href="/seller/dashboard" className="flex items-center gap-2 font-extrabold tracking-tight text-violet-800">
              <span className="grid size-8 place-items-center rounded-xl bg-violet-700 text-sm text-white">✦</span>
              TRENDROP
            </Link>
            <span className="hidden h-6 w-px bg-slate-200 sm:block" />
            <Link href="/seller/dashboard" className="hidden text-sm text-slate-500 hover:text-violet-700 sm:block">← Back to Seller Hub</Link>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="hidden rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-800 sm:inline-flex">🔒 Encrypted onboarding vault</span>
            <span className="grid size-8 place-items-center rounded-full bg-violet-100 text-xs font-bold text-violet-800">HG</span>
            <span className="hidden text-sm font-semibold sm:block">HyperGlow Studio</span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-7 sm:py-9">
        <section className="mb-6 grid gap-5 rounded-3xl bg-gradient-to-br from-violet-50 via-white to-indigo-50 p-5 sm:p-7 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <span className="mb-3 inline-flex rounded-full bg-violet-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[.16em] text-violet-700">• Merchant KYC & onboarding vault</span>
            <h1 className="font-[family-name:var(--font-headline)] text-2xl font-bold tracking-tight sm:text-3xl">Become a Verified Merchant on <span className="text-violet-700">TRENDROP</span></h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Fast-track onboarding with automated identity checks, institutional escrow clearance, and direct payouts in under 24 hours.</p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:max-w-[480px]">
            {[
              ["◉", "Partner", "Stripe Identity"],
              ["▤", "Federal", "FinCEN CDD"],
              ["⌑", "Encryption", "256-bit vault"],
              ["✦", "Allocation", "Tier 1 drop access"],
            ].map(([icon, title, detail]) => (
              <div key={title} className="rounded-2xl border border-white bg-white/80 p-3 shadow-sm">
                <span className="text-violet-700">{icon}</span><p className="mt-1 text-[10px] text-slate-500">{title}</p><p className="text-xs font-semibold">{detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-6 rounded-2xl border border-violet-100 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><p className="text-xs font-bold uppercase tracking-wider text-violet-700">Step {activeStep + 1} of 5</p><p className="mt-1 text-sm font-semibold">{steps[activeStep]}</p></div>
            <div className="text-right text-xs text-slate-500"><span>◷ Approx. 4 mins remaining</span><p className="mt-1 font-semibold text-violet-700">{Math.round(((activeStep + 1) / steps.length) * 100)}% completed</p></div>
          </div>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-violet-100"><div className="h-full rounded-full bg-violet-700 transition-all" style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }} /></div>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
            {steps.map((step, index) => (
              <button key={step} onClick={() => setActiveStep(index)} className={`flex items-center gap-2 rounded-xl px-2.5 py-2 text-left text-[11px] transition ${index === activeStep ? "bg-violet-700 text-white" : index < activeStep ? "bg-emerald-50 text-emerald-800" : "bg-slate-50 text-slate-500 hover:bg-violet-50"}`}>
                <span className={`grid size-6 shrink-0 place-items-center rounded-full text-[10px] font-bold ${index === activeStep ? "bg-white/20" : "bg-white"}`}>{index < activeStep ? "✓" : index + 1}</span>
                <span><span className="block text-[9px] uppercase opacity-70">Step 0{index + 1}</span><span className="font-semibold">{step}</span></span>
              </button>
            ))}
          </div>
        </section>

        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.9fr)_minmax(280px,.9fr)]">
          <div className="space-y-5">
            <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div><p className="text-[10px] font-bold uppercase tracking-[.15em] text-violet-700">• Required step</p><h2 className="mt-1 text-sm font-bold">1. Government Identity Verification</h2><p className="mt-1 text-xs text-slate-500">Select your primary official credential. OCR reads and checks in real time.</p></div>
                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-medium text-emerald-700">⌁ Automated OCR active</span>
              </div>
              <fieldset className="mt-5">
                <legend className="mb-2 text-xs font-semibold">Choose document type</legend>
                <div className="grid gap-2 sm:grid-cols-3">
                  {documents.map((item) => (
                    <button type="button" key={item.name} onClick={() => setDocument(item.name)} className={`rounded-xl border p-3 text-left transition ${document === item.name ? "border-violet-500 bg-violet-50 text-violet-800 ring-1 ring-violet-200" : "border-slate-100 bg-slate-50 hover:border-violet-200"}`}>
                      <span className="flex items-center justify-between text-lg">{item.mark}<span className="text-xs">{document === item.name ? "●" : "○"}</span></span>
                      <span className="mt-2 block text-xs font-semibold">{item.name}</span><span className="mt-0.5 block text-[10px] text-slate-500">{item.detail}</span>
                    </button>
                  ))}
                </div>
              </fieldset>
              <label onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={onDrop} className={`mt-4 flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-5 text-center transition ${dragging ? "border-violet-500 bg-violet-50" : "border-violet-100 bg-[#f7f6ff] hover:border-violet-300"}`}>
                <input type="file" accept="image/*,.pdf" multiple className="sr-only" onChange={onFileChange} />
                <span className="grid size-10 place-items-center rounded-full bg-violet-100 text-xl text-violet-700">⇧</span>
                <span className="mt-2 text-xs font-semibold">{dragging ? "Drop your documents here" : "Drag & drop document scans, or browse files"}</span>
                <span className="mt-1 text-[10px] text-slate-500">PNG, JPG, or PDF up to 25MB · Front and back required</span>
                <span className="mt-2 rounded-full bg-white px-3 py-1 text-[10px] text-violet-700 shadow-sm">Instant edge OCR · Tamper detection</span>
              </label>
              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between"><p className="text-xs font-semibold">Uploaded document payload ({files.length} files)</p><button onClick={() => setFiles([])} className="text-[10px] text-slate-500 hover:text-rose-600">Remove all</button></div>
                {files.length ? <div className="grid gap-2 sm:grid-cols-2">{files.map((file, index) => <div key={`${file}-${index}`} className="flex min-w-0 items-center gap-2 rounded-xl bg-slate-50 p-2.5"><span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white text-lg">▧</span><div className="min-w-0 flex-1"><p className="truncate text-[10px] font-semibold">{file}</p><p className="text-[9px] text-slate-500">Document · Added to this session</p></div><span className="rounded-full bg-emerald-100 px-2 py-1 text-[9px] font-semibold text-emerald-700">Ready</span><button aria-label={`Remove ${file}`} onClick={() => setFiles((current) => current.filter((_, fileIndex) => fileIndex !== index))} className="px-1 text-slate-400 hover:text-rose-600">×</button></div>)}</div> : <p className="rounded-lg bg-amber-50 p-3 text-xs text-amber-800">Add the front and back of your {document.toLowerCase()} to continue.</p>}
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                {["Parsed legal name: Elena Rostova", "Date of birth: Aug 14, 1994", "OCR confidence: 99.4%"].map((item) => <div key={item} className="rounded-lg border border-slate-100 p-2 text-[10px] text-slate-600">{item}</div>)}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[.15em] text-violet-700">• Biometric validation</p><h2 className="mt-1 text-sm font-bold">2. 3D Facial Liveness & Match</h2><p className="mt-1 max-w-2xl text-xs text-slate-500">Anti-spoofing video check ensures physical presence and matches your government ID photograph.</p></div><span className="rounded-full bg-violet-50 px-3 py-1.5 text-[10px] font-semibold text-violet-700">◎ Match 99.8% expected</span></div>
              <div className="mt-5 grid gap-4 md:grid-cols-[.85fr_1.15fr]">
                <div className="relative flex min-h-48 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 via-violet-900 to-indigo-950 p-4 text-center text-white">
                  <div className="absolute inset-5 rounded-[45%] border border-dashed border-violet-300/70" />
                  <div className="relative"><span className="text-6xl">◉</span><p className="mt-2 text-xs font-semibold">{cameraReady ? "Camera check ready" : "Liveness sensor preview"}</p><p className="mt-1 text-[10px] text-violet-100">Position your face within the oval</p></div>
                  <span className="absolute left-3 top-3 rounded-full bg-emerald-500/90 px-2 py-1 text-[9px]">● {cameraReady ? "Device verified" : "Sensor ready"}</span>
                </div>
                <div><h3 className="text-xs font-semibold">Liveness check protocol</h3><div className="mt-2 space-y-2">{[["☼", "Ambient even illumination", "Avoid harsh backlighting, strong shadows, or colored LED strips."], ["◉", "Unobstructed sightlines", "Remove sunglasses, hats, or heavy face masks prior to scan initiation."], ["✳", "Natural micro-movement", "Follow the 3D prompt cues on screen during the 5-second depth capture."]].map(([icon, title, body]) => <div key={title} className="flex gap-3 rounded-xl bg-violet-50/80 p-3"><span className="text-violet-700">{icon}</span><div><p className="text-[11px] font-semibold">{title}</p><p className="mt-0.5 text-[10px] leading-4 text-slate-500">{body}</p></div></div>)}</div></div>
              </div>
              <button onClick={() => { setCameraReady((ready) => !ready); setMessage(cameraReady ? "Camera verification paused." : "Camera preview is ready. This demo does not capture or transmit video."); }} className="mt-4 w-full rounded-xl bg-violet-700 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-violet-800 sm:w-auto">◎ {cameraReady ? "Pause Camera Verification" : "Launch Camera Verification"}</button>
              <div className="my-3 flex items-center gap-3 text-[9px] text-slate-400"><span className="h-px flex-1 bg-slate-100" />OR DESKTOP TO MOBILE HAND-OFF<span className="h-px flex-1 bg-slate-100" /></div>
              <button onClick={() => setMessage("A demo hand-off code is ready to scan. No device pairing was started.")} className="w-full rounded-xl bg-violet-50 px-4 py-2.5 text-xs font-medium text-violet-800 hover:bg-violet-100">▦ Scan QR Code to Finish on iPhone / Android</button>
            </section>

            <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between gap-3"><div><p className="text-xs font-bold">Automated AI feedback engine</p><p className="mt-1 text-[10px] text-slate-500">Interactive review states for your onboarding checklist</p></div><span className="rounded bg-slate-100 px-2 py-1 text-[9px] uppercase tracking-wide text-slate-600">Live preview</span></div>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">{[["✓ ID scan approved", "Document images are ready for a review.", "bg-emerald-50 text-emerald-800"], ["◷ Liveness in review", "Depth map calculation can take a moment.", "bg-amber-50 text-amber-800"], ["△ Anti-glare notice", "Retake in diffused natural lighting.", "bg-rose-50 text-rose-800"]].map(([title, detail, color]) => <div key={title} className={`rounded-xl p-3 ${color}`}><p className="text-[10px] font-semibold">{title}</p><p className="mt-1 text-[10px] leading-4 opacity-80">{detail}</p></div>)}</div>
            </section>

            <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.15em] text-violet-700">• Step 4 queued</p><h2 className="mt-1 text-sm font-bold">3. Business Registration & Tax Profile</h2></div><span className="rounded-full bg-violet-50 px-3 py-1 text-[9px] text-violet-700">Pre-filled from profile</span></div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="text-[10px] font-semibold">Public merchant brand name<input defaultValue="HyperGlow Studio" className="mt-1 block w-full rounded-lg border-0 bg-slate-50 px-3 py-2 text-xs font-normal ring-1 ring-slate-100 focus:ring-violet-400" /></label>
                <label className="text-[10px] font-semibold">Legal structure<select defaultValue="Limited Liability Company (LLC)" className="mt-1 block w-full rounded-lg border-0 bg-slate-50 px-3 py-2 text-xs font-normal ring-1 ring-slate-100 focus:ring-violet-400"><option>Limited Liability Company (LLC)</option><option>Sole proprietorship</option><option>Corporation</option><option>Partnership</option></select></label>
                <label className="text-[10px] font-semibold">Federal Tax ID / EIN<input defaultValue="XX-XXX9284" className="mt-1 block w-full rounded-lg border-0 bg-slate-50 px-3 py-2 text-xs font-normal ring-1 ring-slate-100 focus:ring-violet-400" /></label>
                <label className="text-[10px] font-semibold">Drop merchant category<select defaultValue="Viral Gadgets & LED Lifestyle" className="mt-1 block w-full rounded-lg border-0 bg-slate-50 px-3 py-2 text-xs font-normal ring-1 ring-slate-100 focus:ring-violet-400"><option>Viral Gadgets & LED Lifestyle</option><option>Beauty & wellness</option><option>Home & living</option><option>Fashion & accessories</option></select></label>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
              <p className="text-[10px] font-bold uppercase tracking-[.15em] text-rose-600">• Step 5 queued</p><h2 className="mt-1 text-sm font-bold">4. Settlement Banking & Escrow Rails</h2>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-violet-50 p-3"><div><p className="text-xs font-semibold">JPMorgan Chase Bank, N.A. · Checking •• 4091</p><p className="mt-1 text-[10px] text-slate-500">Payout routing details stay protected during setup.</p></div><span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-semibold text-emerald-700">● Connection preview</span></div>
              <p className="mt-3 text-[10px] text-slate-500">🔒 Your banking and tax details are for this local interface preview only and are not submitted.</p>
            </section>

            <div className="flex flex-col-reverse justify-between gap-3 pb-3 sm:flex-row">
              <button onClick={() => setMessage("Draft kept in the current page session only. Nothing was saved remotely.")} className="rounded-xl bg-violet-100 px-4 py-2.5 text-xs font-semibold text-violet-800 hover:bg-violet-200">Save Draft & Exit</button>
              <button onClick={continueStep} disabled={files.length === 0 && activeStep === 1} className="rounded-xl bg-violet-700 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-violet-200 hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-50">Save & Continue to {activeStep < 2 ? steps[activeStep + 1] : "Next Step"} →</button>
            </div>
          </div>

          <aside className="space-y-5 xl:sticky xl:top-24">
            <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between"><h2 className="text-sm font-bold">Onboarding status</h2><span className="rounded-full bg-violet-100 px-2.5 py-1 text-[9px] font-semibold text-violet-700">Live monitor</span></div>
              <div className="mt-4 space-y-2">{[["Store profile & contact", "PASSED"], ["Mobile 2FA hardware auth", "PASSED"], ["Government ID OCR scan", files.length > 0 ? "READY" : "NEEDED"], ["Biometric liveness check", cameraReady ? "READY" : "QUEUED"], ["Tax entity reconciliation", "QUEUED"], ["Merchant live badge issued", "PENDING"]].map(([label, status]) => <div key={label} className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2"><span className="text-[10px] text-slate-700"><Check /> {label}</span><span className={`text-[9px] font-bold ${status === "PASSED" ? "text-emerald-700" : "text-violet-700"}`}>{status}</span></div>)}</div>
              <div className="mt-4 flex items-center gap-3 rounded-xl bg-violet-50 p-3"><span className="grid size-12 shrink-0 place-items-center rounded-full border-4 border-violet-600 text-xs font-bold text-violet-700">75%</span><div><p className="text-[11px] font-semibold">Trust score potential</p><p className="mt-0.5 text-[10px] leading-4 text-slate-500">Completing biometrics unlocks instant drop payout limits.</p></div></div>
            </section>
            <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-bold">⚑ Regulatory compliance</h2><p className="mt-2 text-[10px] leading-5 text-slate-500">FinCEN and global AML guidelines require identity reconciliation to safeguard creators against unauthorized impersonation, drop-front-running, and chargeback abuse.</p>
              <div className="mt-4 grid grid-cols-2 gap-2"><div className="rounded-xl bg-slate-50 p-3 text-center"><p className="text-[9px] text-slate-500">CERTIFIED</p><p className="mt-1 text-xs font-bold">SOC2 Type II</p></div><div className="rounded-xl bg-slate-50 p-3 text-center"><p className="text-[9px] text-slate-500">SECURITY</p><p className="mt-1 text-xs font-bold">PCI-DSS L1</p></div></div>
            </section>
            <section className="rounded-2xl bg-gradient-to-br from-violet-700 to-violet-900 p-5 text-white shadow-lg shadow-violet-200">
              <p className="text-xs font-semibold">● Specialist online</p><h2 className="mt-2 text-sm font-bold">Onboarding concierge</h2><p className="mt-2 text-[10px] leading-5 text-violet-100">Having trouble scanning your passport or document? Our compliance engineers can verify essentials manually in real time.</p>
              <button onClick={() => setMessage("Concierge chat is a preview. No support request was sent.")} className="mt-4 w-full rounded-lg bg-white px-3 py-2 text-xs font-semibold text-violet-800 hover:bg-violet-50">▣ Launch Live Support Chat</button><p className="mt-2 text-center text-[9px] text-violet-200">Typical response under 2 minutes</p>
            </section>
          </aside>
        </div>
        {message && <div role="status" className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-slate-900 px-4 py-3 text-xs text-white shadow-xl">{message}<button aria-label="Dismiss message" onClick={() => setMessage("")} className="ml-3 text-slate-300">×</button></div>}
      </div>
      <footer className="border-t border-violet-100 bg-white px-4 py-4 text-[10px] text-slate-500"><div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-2"><span className="font-bold text-violet-800">✦ TRENDROP</span><span>© 2025 TRENDROP Global Inc. · High-velocity social commerce architecture.</span><span>🔒 Encrypted checkout vault · Globally tracked drops</span></div></footer>
    </main>
  );
}
