"use client";
import { useRouter } from "next/navigation";
import { assetManagers } from "../lib/assetManagers";

export default function HomePage() {
  const router = useRouter();

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const amId = e.target.value;
    if (amId) router.push(`/leases/${amId}`);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <HeroBackground />

      <div className="relative z-10 flex flex-col items-center justify-center px-6 pt-24">
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
          Lease End Dashboard
        </h1>
        <p className="mt-3 text-zinc-400 text-center max-w-md">
          Please select an Asset Manager to see your coming ending leases.
        </p>

        <div className="mt-10 w-full max-w-sm">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-2xl">
            <label className="block text-sm text-zinc-200 mb-2">
              Asset Manager
            </label>
            <select
              onChange={handleSelect}
              defaultValue=""
              className="w-full rounded-xl border border-white/15 
                         bg-white text-black px-3 py-2 
                         outline-none focus:border-white/25"
            >
              <option value="" disabled>
                -- Select an AM --
              </option>
              {Object.entries(assetManagers).map(([id, am]) => (
                <option key={id} value={id}>
                  {am.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </main>
  );
}

/* === Fond discret réutilisable === */
function HeroBackground() {
  return (
    <>
      <div className="absolute inset-0 z-0 bg-gradient-to-tr from-[#0b0f2e] via-[#081436] to-[#021b3a]" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(80rem_40rem_at_10%_80%,rgba(255,153,51,0.15),transparent_60%)]" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(80rem_40rem_at_90%_10%,rgba(64,149,255,0.2),transparent_60%)]" />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/10 via-black/40 to-black/70" />
    </>
  );
}
