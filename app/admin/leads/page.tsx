import { getPool } from "@/lib/db";

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  subject: string | null;
  message: string;
  created_at: string;
}

async function getLeads(): Promise<Lead[]> {
  const pool = getPool();
  const [rows] = await pool.execute(
    "SELECT id, name, email, phone, company, subject, message, created_at FROM contact_leads ORDER BY created_at DESC"
  );
  return rows as Lead[];
}

export default async function AdminLeadsPage() {
  let leads: Lead[] = [];
  let error: string | null = null;

  try {
    leads = await getLeads();
  } catch (e) {
    error = "Failed to connect to the database. Check your DB credentials in .env.local.";
    console.error(e);
  }

  return (
    <div style={{ fontFamily: '"Inter", sans-serif' }} className="min-h-screen bg-[#0F1115] text-[#F1F3F5] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 border-b border-white/10 pb-6">
          <h1 className="text-3xl font-black text-[#FFD000] tracking-tight">Contact Leads</h1>
          <p className="text-[#98A2B3] mt-1 font-mono text-sm">
            {error ? "—" : `${leads.length} total lead${leads.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-900/20 border border-red-500/30 text-red-400 font-mono text-sm mb-6">
            ⚠ {error}
          </div>
        )}

        {!error && leads.length === 0 && (
          <div className="text-center py-24 text-[#98A2B3] font-mono">
            No leads yet. Submissions will appear here.
          </div>
        )}

        {!error && leads.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  {["ID", "Name", "Email", "Phone", "Company", "Subject", "Message", "Submitted"].map((h) => (
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
                      i % 2 === 0 ? "bg-transparent" : "bg-[#1A1D24]/40"
                    }`}
                  >
                    <td className="py-3 px-4 font-mono text-[#FFD000]/60 text-xs">{lead.id}</td>
                    <td className="py-3 px-4 font-semibold text-[#F1F3F5] whitespace-nowrap">{lead.name}</td>
                    <td className="py-3 px-4">
                      <a href={`mailto:${lead.email}`} className="text-[#FFD000] hover:underline">
                        {lead.email}
                      </a>
                    </td>
                    <td className="py-3 px-4 text-[#98A2B3]">{lead.phone || "—"}</td>
                    <td className="py-3 px-4 text-[#98A2B3]">{lead.company || "—"}</td>
                    <td className="py-3 px-4 text-[#98A2B3]">{lead.subject || "—"}</td>
                    <td className="py-3 px-4 text-[#98A2B3] max-w-xs">
                      <p className="truncate" title={lead.message}>
                        {lead.message}
                      </p>
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
    </div>
  );
}
