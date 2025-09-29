"use client";
import { useEffect, useState } from "react";
import { assetManagers } from "../../../lib/assetManagers";

type Lease = {
  id: number;
  display_name: string;
  date_end: string;
  current_rent: number;
  space: number;
};

export default function LeaseClient({ amId }: { amId: string }) {
  const [leases, setLeases] = useState<Lease[]>([]);

  useEffect(() => {
    fetch(`/api/leases/${amId}`)
      .then((res) => res.json())
      .then((data: Lease[]) => {
        const sorted = [...data].sort(
          (a, b) => (b.current_rent || 0) - (a.current_rent || 0)
        );
        setLeases(sorted);
      })
      .catch(console.error);
  }, [amId]);

  const am = assetManagers[Number(amId)];

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <HeroBackground />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-16">
        <h1 className="text-4xl font-semibold tracking-tight mb-8">
          Lease Ends for {am?.name}
        </h1>

        {leases.length === 0 ? (
          <p className="text-zinc-400">Aucun lease trouvé.</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-white/10 text-left text-zinc-300">
                  <th className="px-4 py-3">Tenant</th>
                  <th className="px-4 py-3">End date</th>
                  <th className="px-4 py-3 text-right">Rent</th>
                  <th className="px-4 py-3 text-right">Space</th>
                </tr>
              </thead>
              <tbody>
                {leases.map((l, i) => (
                  <tr
                    key={l.id}
                    className={
                      i % 2 === 0
                        ? "border-t border-white/5"
                        : "border-t border-white/5 bg-white/5"
                    }
                  >
                    <td className="px-4 py-3">{l.display_name}</td>
                    <td className="px-4 py-3">{formatDate(l.date_end)}</td>
                    <td className="px-4 py-3 text-right">
                      {formatInt(l.current_rent)}
                    </td>
                    <td className="px-4 py-3 text-right">{formatInt(l.space)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}

/* === Fond réutilisé === */
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

/* === Helpers === */
function formatDate(d?: string) {
  if (!d) return "-";
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
}
function formatInt(v?: number) {
  if (typeof v !== "number" || isNaN(v)) return "-";
  return Math.round(v).toLocaleString("fr-FR");
}
