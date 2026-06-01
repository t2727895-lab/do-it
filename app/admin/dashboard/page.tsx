import { getPool } from "@/lib/db";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";
import LogoutButton from "@/components/admin/LogoutButton";
import { RowDataPacket } from "mysql2";

interface Lead extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  subject: string | null;
  message: string;
  status: string;
  created_at: string;
}

interface StatsRow extends RowDataPacket {
  total: number;
  new_leads: number;
  contacted: number;
  converted: number;
  today: number;
}

async function getData() {
  const pool = getPool();

  const [[stats]] = await pool.execute<StatsRow[]>(`
    SELECT
      COUNT(*) AS total,
      SUM(status = 'new') AS new_leads,
      SUM(status = 'contacted') AS contacted,
      SUM(status = 'converted') AS converted,
      SUM(DATE(created_at) = CURDATE()) AS today
    FROM contact_leads
  `);

  const [leads] = await pool.execute<Lead[]>(
    `SELECT id, name, email, phone, company, subject, message, status, created_at
     FROM contact_leads
     ORDER BY created_at DESC`
  );

  return { stats, leads };
}

const statusColors: Record<string, string> = {
  new: "bg-[#FFD000]/10 text-[#FFD000] border-[#FFD000]/20",
  contacted: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  converted: "bg-green-500/10 text-green-400 border-green-500/20",
  spam: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default async function DashboardPage() {
  // Get session for username display
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const session = await getIronSession<SessionData>(
    new Request("http://localhost", { headers: { cookie: cookieHeader } }),
    new Response(),
    sessionOptions
  );

  let stats: StatsRow | null = null;
  let leads: Lead[] = [];
  let dbError: string | null = null;

  try {
    const data = await getData();
    stats = data.stats;
    leads = data.leads;
  } catch (e) {
    dbError = "Database connection failed. Check DB credentials in .env.local.";
    console.error(e);
  }

  return (
    <div className="min-h-screen bg-[#0F1115] text-[#F1F3F5]">
      {/* Top Nav */}
      <header className="border-b border-white/10 bg-[#1A1D24] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-black text-[#FFD000] tracking-tight">QUILONIX</span>
            <span className="text-[#98A2B3] text-xs font-mono border-l border-white/10 pl-3 uppercase tracking-widest">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-[#98A2B3] hidden sm:block">
              {session.username || "admin"}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-[#F1F3F5]">Dashboard</h1>
          <p className="text-[#98A2B3] text-sm font-mono mt-1">Contact leads overview</p>
        </div>

        {dbError && (
          <div className="p-4 bg-red-900/20 border border-red-500/30 text-red-400 font-mono text-sm mb-8">
            ⚠ {dbError}
          </div>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
            {[
              { label: "Total Leads", value: stats.total ?? 0, accent: "#FFD000" },
              { label: "New", value: stats.new_leads ?? 0, accent: "#FFD000" },
              { label: "Contacted", value: stats.contacted ?? 0, accent: "#60a5fa" },
              { label: "Converted", value: stats.converted ?? 0, accent: "#4ade80" },
              { label: "Today", value: stats.today ?? 0, accent: "#FFB300" },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-[#1A1D24] border border-white/5 p-5 flex flex-col gap-1"
              >
                <span className="text-xs font-mono text-[#98A2B3] uppercase tracking-widest">
                  {s.label}
                </span>
                <span
                  className="text-3xl font-black"
                  style={{ color: s.accent }}
                >
                  {s.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Leads Table */}
        <div className="bg-[#1A1D24] border border-white/5">
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <h2 className="font-bold text-[#F1F3F5]">All Leads</h2>
            <span className="text-xs font-mono text-[#98A2B3]">
              {leads.length} record{leads.length !== 1 ? "s" : ""}
            </span>
          </div>

          {leads.length === 0 && !dbError ? (
            <div className="text-center py-20 text-[#98A2B3] font-mono text-sm">
              No leads yet. Form submissions will appear here.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    {["#", "Name", "Email", "Phone", "Company", "Subject", "Message", "Status", "Date"].map((h) => (
                      <th
                        key={h}
                        className="text-left py-3 px-4 text-xs font-mono text-[#98A2B3] uppercase tracking-widest whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead, i) => (
                    <tr
                      key={lead.id}
                      className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors ${
                        i % 2 === 0 ? "" : "bg-white/[0.01]"
                      }`}
                    >
                      <td className="py-3 px-4 font-mono text-[#FFD000]/50 text-xs">{lead.id}</td>
                      <td className="py-3 px-4 font-semibold text-[#F1F3F5] whitespace-nowrap">{lead.name}</td>
                      <td className="py-3 px-4">
                        <a href={`mailto:${lead.email}`} className="text-[#FFD000] hover:underline">
                          {lead.email}
                        </a>
                      </td>
                      <td className="py-3 px-4 text-[#98A2B3] whitespace-nowrap">{lead.phone || "—"}</td>
                      <td className="py-3 px-4 text-[#98A2B3] whitespace-nowrap">{lead.company || "—"}</td>
                      <td className="py-3 px-4 text-[#98A2B3] max-w-[160px]">
                        <span className="truncate block" title={lead.subject || ""}>
                          {lead.subject || "—"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#98A2B3] max-w-[220px]">
                        <span className="truncate block" title={lead.message}>
                          {lead.message}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 text-xs font-mono border capitalize ${
                            statusColors[lead.status] ?? statusColors.new
                          }`}
                        >
                          {lead.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#98A2B3] whitespace-nowrap font-mono text-xs">
                        {new Date(lead.created_at).toLocaleString("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
