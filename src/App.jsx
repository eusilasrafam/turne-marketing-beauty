import { useState } from "react";

const CITIES = [
  { name: "Parauapebas", date: "14 de Junho", dateShort: "14/06/2026", emoji: "🔥" },
  { name: "Marabá", date: "17 de Junho", dateShort: "17/06/2026", emoji: "✨" },
  { name: "Teresina", date: "29 de Junho", dateShort: "29/06/2026", emoji: "💫" },
];

const PAYMENT_METHODS = ["PIX", "Cartão de Crédito", "Cartão de Débito", "Boleto", "Dinheiro", "Transferência"];

const generateId = () => Math.random().toString(36).substr(2, 9);

const formatPhone = (v) => {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 7) return `(${d.slice(0,2)}) ${d.slice(2)}`;
  return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
};

const formatCurrency = (v) => {
  const n = parseFloat(v);
  if (isNaN(n)) return "R$ 0,00";
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

const formatDate = (s) => {
  if (!s) return "—";
  const [y, m, d] = s.split("-");
  return `${d}/${m}/${y}`;
};

const today = () => new Date().toISOString().split("T")[0];

const downloadTicket = (student) => {
  const city = CITIES.find(c => c.name === student.city);
  const val = parseFloat(student.value) || 0;
  const valStr = val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
  <defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#0f172a"/><stop offset="100%" style="stop-color:#1e293b"/></linearGradient></defs>
  <rect width="800" height="500" fill="url(#bg)" rx="20"/>
  <rect x="16" y="16" width="768" height="468" rx="14" fill="none" stroke="#a78bfa" stroke-width="1" opacity="0.3"/>
  <circle cx="700" cy="80" r="140" fill="#7c3aed" opacity="0.04"/>
  <circle cx="100" cy="420" r="100" fill="#a78bfa" opacity="0.03"/>
  <text x="400" y="55" text-anchor="middle" font-family="system-ui" font-size="11" letter-spacing="5" fill="#a78bfa" opacity="0.7">INGRESSO OFICIAL</text>
  <text x="400" y="100" text-anchor="middle" font-family="system-ui" font-size="36" font-weight="800" fill="#f8fafc" letter-spacing="3">TURNE</text>
  <line x1="300" y1="105" x2="500" y2="105" stroke="#7c3aed" stroke-width="2"/>
  <text x="400" y="132" text-anchor="middle" font-family="system-ui" font-size="16" letter-spacing="4" fill="#a78bfa">MARKETING &amp; BEAUTY</text>
  <line x1="220" y1="150" x2="580" y2="150" stroke="#334155" stroke-width="0.5"/>
  <text x="400" y="180" text-anchor="middle" font-family="system-ui" font-size="10" fill="#64748b" letter-spacing="3">PARTICIPANTE</text>
  <text x="400" y="212" text-anchor="middle" font-family="system-ui" font-size="24" font-weight="700" fill="#f1f5f9">${student.name.toUpperCase()}</text>
  <text x="400" y="238" text-anchor="middle" font-family="system-ui" font-size="13" fill="#94a3b8">${student.phone}</text>
  <rect x="250" y="260" width="300" height="56" rx="10" fill="#1e293b" stroke="#334155" stroke-width="0.5"/>
  <text x="400" y="286" text-anchor="middle" font-family="system-ui" font-size="18" font-weight="700" fill="#a78bfa">${(city?.name || student.city).toUpperCase()}</text>
  <text x="400" y="306" text-anchor="middle" font-family="system-ui" font-size="12" fill="#94a3b8">${city?.date || ""} de 2026</text>
  <rect x="300" y="330" width="200" height="36" rx="8" fill="#0d3320" stroke="#166534" stroke-width="0.5"/>
  <text x="400" y="354" text-anchor="middle" font-family="system-ui" font-size="16" font-weight="700" fill="#22c55e">${valStr}</text>
  <line x1="220" y1="390" x2="580" y2="390" stroke="#334155" stroke-width="0.5"/>
  <text x="400" y="418" text-anchor="middle" font-family="system-ui" font-size="9" fill="#64748b">ID: ${student.id.toUpperCase()}  ·  Cadastro: ${formatDate(student.registrationDate)}</text>
  <text x="400" y="442" text-anchor="middle" font-family="system-ui" font-size="10" fill="#22c55e" font-weight="600">✓ PAGAMENTO CONFIRMADO</text>
</svg>`;
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `ingresso-${student.name.replace(/\s+/g, "-").toLowerCase()}.svg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const C = {
  bg: "#0f172a", surface: "#1e293b", border: "#334155", borderLight: "#475569",
  text: "#f1f5f9", textSec: "#94a3b8", textMut: "#64748b",
  pri: "#7c3aed", priL: "#a78bfa", priBg: "rgba(124,58,237,0.12)", priBo: "rgba(124,58,237,0.3)",
  ok: "#22c55e", okBg: "rgba(34,197,94,0.1)", okBo: "rgba(34,197,94,0.25)",
  warn: "#f59e0b", warnBg: "rgba(245,158,11,0.1)", warnBo: "rgba(245,158,11,0.25)",
  err: "#ef4444",
};

const Ic = {
  dash: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>,
  add: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M12 5v14m-7-7h14"/></svg>,
  list: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>,
  city: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4"/></svg>,
  edit: <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash: <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  ticket: <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M2 9a3 3 0 0 1 0 6v5h20v-5a3 3 0 0 1 0-6V4H2Z"/><path d="M13 4v2m0 14v2m0-10v2"/></svg>,
  search: <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  check: <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M20 6 9 17l-5-5"/></svg>,
  clock: <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
  dollar: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M12 1v22m5-18H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H7"/></svg>,
};

function StudentRow({ student, onEdit, onDelete, onTicket }) {
  const isPaid = student.paymentStatus === "Finalizado";
  return (
    <div className="student-row">
      <div className="student-main">
        <div style={{ fontWeight: "600", color: C.text, fontSize: "14px" }}>{student.name}</div>
        <div style={{ fontSize: "12px", color: C.textMut, marginTop: "2px" }}>{student.phone}</div>
      </div>
      <div className="student-city">
        <div style={{ fontSize: "13px", color: C.priL, fontWeight: "500" }}>{student.city}</div>
        <div style={{ fontSize: "11px", color: C.textMut }}>{CITIES.find(c => c.name === student.city)?.date}</div>
      </div>
      <div className="student-value">
        <div style={{ fontSize: "14px", color: C.ok, fontWeight: "600" }}>{formatCurrency(student.value)}</div>
        <div style={{ fontSize: "11px", color: C.textMut }}>{student.paymentMethod}</div>
      </div>
      <div className="student-status">
        <span style={{
          display: "inline-flex", alignItems: "center", gap: "5px",
          padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "600",
          background: isPaid ? C.okBg : C.warnBg, color: isPaid ? C.ok : C.warn,
          border: `1px solid ${isPaid ? C.okBo : C.warnBo}`, whiteSpace: "nowrap",
        }}>{isPaid ? Ic.check : Ic.clock} {isPaid ? "Pago" : "Pendente"}</span>
      </div>
      <div className="student-actions">
        <button onClick={() => onEdit(student)} title="Editar" style={{
          width: "32px", height: "32px", borderRadius: "6px", border: `1px solid ${C.border}`,
          background: "transparent", color: C.textMut, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>{Ic.edit}</button>
        {isPaid && (
          <button onClick={() => onTicket(student)} title="Gerar Ingresso" style={{
            width: "32px", height: "32px", borderRadius: "6px", border: `1px solid ${C.okBo}`,
            background: C.okBg, color: C.ok, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>{Ic.ticket}</button>
        )}
        <button onClick={() => onDelete(student.id)} title="Excluir" style={{
          width: "32px", height: "32px", borderRadius: "6px", border: `1px solid ${C.border}`,
          background: "transparent", color: C.textMut, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>{Ic.trash}</button>
      </div>
    </div>
  );
}

export default function App() {
  const [students, setStudents] = useState([]);
  const [tab, setTab] = useState("dashboard");
  const [editingId, setEditingId] = useState(null);
  const [filterCity, setFilterCity] = useState("Todas");
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({
    name: "", phone: "", city: CITIES[0].name,
    paymentMethod: PAYMENT_METHODS[0], paymentStatus: "Pendente",
    registrationDate: today(), paymentDate: "", value: "",
  });

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const resetForm = () => {
    setForm({ name: "", phone: "", city: CITIES[0].name, paymentMethod: PAYMENT_METHODS[0], paymentStatus: "Pendente", registrationDate: today(), paymentDate: "", value: "" });
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!form.name.trim() || !form.phone.trim()) { showToast("Preencha nome e telefone!", "error"); return; }
    if (editingId) {
      setStudents(p => p.map(s => s.id === editingId ? { ...form, id: editingId } : s));
      showToast("Cadastro atualizado!");
    } else {
      setStudents(p => [...p, { ...form, id: generateId() }]);
      showToast("Aluno cadastrado!");
    }
    resetForm();
  };

  const handleEdit = (s) => { setForm({ ...s }); setEditingId(s.id); setTab("cadastro"); };
  const handleDelete = (id) => { if (window.confirm("Excluir este cadastro?")) { setStudents(p => p.filter(s => s.id !== id)); showToast("Removido.", "error"); } };

  const filtered = students.filter(s => {
    const mc = filterCity === "Todas" || s.city === filterCity;
    const ms = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.phone.includes(searchTerm);
    return mc && ms;
  });

  const totalPaid = students.filter(s => s.paymentStatus === "Finalizado").length;
  const totalSales = students.reduce((sum, s) => sum + (parseFloat(s.value) || 0), 0);
  const totalPaidSales = students.filter(s => s.paymentStatus === "Finalizado").reduce((sum, s) => sum + (parseFloat(s.value) || 0), 0);
  const totalPendingSales = totalSales - totalPaidSales;

  const inp = {
    width: "100%", padding: "10px 14px", background: C.bg, border: `1px solid ${C.border}`,
    borderRadius: "8px", color: C.text, fontSize: "14px", fontFamily: "system-ui, -apple-system, sans-serif",
    outline: "none", boxSizing: "border-box", transition: "border-color 0.15s",
  };
  const lbl = { display: "block", marginBottom: "6px", fontSize: "13px", color: C.textSec, fontWeight: "500" };
  const secTitle = (t) => <div style={{ fontSize: "12px", fontWeight: "600", color: C.textMut, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px" }}>{t}</div>;

  const navItems = [
    { id: "dashboard", icon: Ic.dash, label: "Dashboard" },
    { id: "cadastro", icon: Ic.add, label: "Cadastro" },
    { id: "lista", icon: Ic.list, label: "Alunos", badge: students.length },
    { id: "cidades", icon: Ic.city, label: "Cidades" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {toast && (
        <div style={{
          position: "fixed", top: "16px", right: "16px", zIndex: 1000,
          padding: "12px 20px", borderRadius: "8px",
          background: toast.type === "error" ? C.err : C.ok,
          color: "#fff", fontSize: "13px", fontWeight: "600",
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)", animation: "toastIn 0.25s ease",
          maxWidth: "calc(100vw - 32px)",
        }}>{toast.msg}</div>
      )}

      {/* Header */}
      <div className="app-header" style={{ borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "36px", height: "36px", flexShrink: 0,
            background: `linear-gradient(135deg, ${C.pri}, ${C.priL})`,
            borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: "800", fontSize: "16px", color: "#fff",
          }}>T</div>
          <div>
            <div style={{ fontSize: "16px", fontWeight: "700", color: C.text, letterSpacing: "0.5px" }}>Turnê Marketing & Beauty</div>
            <div style={{ fontSize: "11px", color: C.textMut }}>Sistema de Cadastro de Alunos</div>
          </div>
        </div>
        <div className="header-dates" style={{ fontSize: "12px", color: C.textMut }}>
          <span>Parauapebas · 14/06</span>
          <span>Marabá · 17/06</span>
          <span>Teresina · 29/06</span>
        </div>
      </div>

      {/* Nav */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "6px 8px", display: "flex", gap: "4px", overflowX: "auto" }}>
        {navItems.map(item => (
          <button key={item.id} onClick={() => setTab(item.id)} className="nav-btn" style={{
            display: "flex", alignItems: "center", gap: "6px",
            background: tab === item.id ? C.priBg : "transparent",
            color: tab === item.id ? C.priL : C.textMut,
            border: tab === item.id ? `1px solid ${C.priBo}` : "1px solid transparent",
            borderRadius: "8px", cursor: "pointer",
            fontWeight: tab === item.id ? "600" : "400",
            fontFamily: "system-ui, -apple-system, sans-serif", whiteSpace: "nowrap",
          }}>
            {item.icon}
            <span className="nav-label">{item.label}</span>
            {item.badge > 0 && <span style={{
              background: C.pri, color: "#fff", fontSize: "11px", fontWeight: "700",
              padding: "1px 7px", borderRadius: "10px",
            }}>{item.badge}</span>}
          </button>
        ))}
      </div>

      <div className="page-content">

        {/* DASHBOARD */}
        {tab === "dashboard" && <>
          {secTitle("Resumo geral")}
          <div className="stats-grid" style={{ marginBottom: "16px" }}>
            {[
              { l: "Total de inscritos", v: students.length, c: C.text },
              { l: "Pagamentos finalizados", v: totalPaid, c: C.ok },
              { l: "Pendentes", v: students.length - totalPaid, c: C.warn },
            ].map((s, i) => (
              <div key={i} className="stat-card" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: "12px", color: C.textMut, fontWeight: "500", marginBottom: "8px" }}>{s.l}</div>
                <div style={{ fontSize: "32px", fontWeight: "700", color: s.c, lineHeight: 1 }}>{s.v}</div>
              </div>
            ))}
          </div>

          {secTitle("Financeiro")}
          <div className="stats-grid" style={{ marginBottom: "28px" }}>
            <div className="stat-card" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <span style={{ color: C.priL }}>{Ic.dollar}</span>
                <span style={{ fontSize: "12px", color: C.textMut, fontWeight: "500" }}>Total em vendas</span>
              </div>
              <div style={{ fontSize: "26px", fontWeight: "700", color: C.text, lineHeight: 1 }}>
                {totalSales.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </div>
            </div>
            <div className="stat-card" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: "12px", color: C.textMut, fontWeight: "500", marginBottom: "8px" }}>Receita confirmada</div>
              <div style={{ fontSize: "26px", fontWeight: "700", color: C.ok, lineHeight: 1 }}>
                {totalPaidSales.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </div>
            </div>
            <div className="stat-card" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: "12px", color: C.textMut, fontWeight: "500", marginBottom: "8px" }}>A receber</div>
              <div style={{ fontSize: "26px", fontWeight: "700", color: C.warn, lineHeight: 1 }}>
                {totalPendingSales.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </div>
            </div>
          </div>

          {secTitle("Cidades do evento")}
          <div className="cities-grid" style={{ marginBottom: "28px" }}>
            {CITIES.map(city => {
              const cs = students.filter(s => s.city === city.name);
              const pd = cs.filter(s => s.paymentStatus === "Finalizado").length;
              const cityTotal = cs.reduce((sum, s) => sum + (parseFloat(s.value) || 0), 0);
              return (
                <div key={city.name} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                    <div>
                      <div style={{ fontSize: "16px", fontWeight: "600", color: C.text }}>{city.name}</div>
                      <div style={{ fontSize: "13px", color: C.priL, marginTop: "2px" }}>{city.date}</div>
                    </div>
                    <span style={{ fontSize: "24px" }}>{city.emoji}</span>
                  </div>
                  <div style={{ display: "flex", gap: "16px", marginBottom: "12px" }}>
                    {[{ v: cs.length, l: "Inscritos", c: C.text }, { v: pd, l: "Pagos", c: C.ok }, { v: cs.length - pd, l: "Pendentes", c: C.warn }].map((x, j) => (
                      <div key={j}>
                        <div style={{ fontSize: "22px", fontWeight: "700", color: x.c }}>{x.v}</div>
                        <div style={{ fontSize: "11px", color: C.textMut, fontWeight: "500" }}>{x.l}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: "10px", fontSize: "13px", color: C.textSec }}>
                    Vendas: <span style={{ fontWeight: "600", color: C.ok }}>{cityTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {students.length === 0 && (
            <div style={{ textAlign: "center", padding: "48px 24px", background: C.surface, borderRadius: "12px", border: `1px dashed ${C.border}` }}>
              <div style={{ width: "56px", height: "56px", margin: "0 auto 16px", background: C.priBg, borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", color: C.priL }}>{Ic.add}</div>
              <div style={{ color: C.textSec, fontSize: "15px", marginBottom: "16px" }}>Nenhum aluno cadastrado ainda</div>
              <button onClick={() => setTab("cadastro")} style={{ padding: "10px 24px", background: C.pri, color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "600", fontFamily: "system-ui, sans-serif" }}>Cadastrar primeiro aluno</button>
            </div>
          )}

          {students.length > 0 && <>
            {secTitle("Últimos cadastros")}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {students.slice(-5).reverse().map(s => (
                <StudentRow key={s.id} student={s} onEdit={handleEdit} onDelete={handleDelete} onTicket={downloadTicket} />
              ))}
            </div>
          </>}
        </>}

        {/* CADASTRO */}
        {tab === "cadastro" && <>
          {secTitle(editingId ? "Editar cadastro" : "Novo cadastro")}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "20px" }}>
            <div className="form-grid">
              <div className="form-full">
                <label style={lbl}>Nome completo *</label>
                <input style={inp} placeholder="Nome do aluno" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label style={lbl}>Telefone *</label>
                <input style={inp} placeholder="(00) 00000-0000" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: formatPhone(e.target.value) }))} />
              </div>
              <div>
                <label style={lbl}>Cidade do evento</label>
                <select style={{ ...inp, cursor: "pointer" }} value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}>
                  {CITIES.map(c => <option key={c.name} value={c.name} style={{ background: C.surface }}>{c.name} — {c.date}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>Valor do ingresso (R$)</label>
                <input style={inp} placeholder="197,00" type="number" step="0.01" min="0"
                  value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} />
              </div>
              <div>
                <label style={lbl}>Forma de pagamento</label>
                <select style={{ ...inp, cursor: "pointer" }} value={form.paymentMethod} onChange={e => setForm(f => ({ ...f, paymentMethod: e.target.value }))}>
                  {PAYMENT_METHODS.map(m => <option key={m} value={m} style={{ background: C.surface }}>{m}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>Status do pagamento</label>
                <select style={{ ...inp, cursor: "pointer" }} value={form.paymentStatus} onChange={e => setForm(f => ({ ...f, paymentStatus: e.target.value }))}>
                  <option value="Pendente" style={{ background: C.surface }}>Saldo pendente</option>
                  <option value="Finalizado" style={{ background: C.surface }}>Pagamento finalizado</option>
                </select>
              </div>
              <div>
                <label style={lbl}>Data do cadastro</label>
                <input type="date" style={inp} value={form.registrationDate} onChange={e => setForm(f => ({ ...f, registrationDate: e.target.value }))} />
              </div>
              <div>
                <label style={lbl}>Data do pagamento (futuro)</label>
                <input type="date" style={inp} value={form.paymentDate} onChange={e => setForm(f => ({ ...f, paymentDate: e.target.value }))} />
              </div>
            </div>
            <div className="form-actions" style={{ borderTop: `1px solid ${C.border}` }}>
              <button onClick={handleSubmit} style={{
                flex: "1", padding: "13px", background: C.pri, color: "#fff", border: "none",
                borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "600", fontFamily: "system-ui, sans-serif",
              }}>{editingId ? "Salvar alterações" : "Cadastrar aluno"}</button>
              {editingId && <button onClick={resetForm} style={{
                padding: "13px 20px", background: "transparent", border: `1px solid ${C.border}`,
                borderRadius: "8px", color: C.textSec, cursor: "pointer", fontSize: "14px", fontFamily: "system-ui, sans-serif",
              }}>Cancelar</button>}
            </div>
          </div>
        </>}

        {/* LISTA */}
        {tab === "lista" && <>
          {secTitle("Lista de alunos")}
          <div className="list-filters">
            <div style={{ position: "relative", flex: "1", minWidth: "0" }}>
              <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: C.textMut }}>{Ic.search}</span>
              <input style={{ ...inp, paddingLeft: "36px" }} placeholder="Buscar nome ou telefone..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <select style={{ ...inp, width: "auto", minWidth: "140px", cursor: "pointer", flexShrink: 0 }} value={filterCity} onChange={e => setFilterCity(e.target.value)}>
              <option value="Todas" style={{ background: C.surface }}>Todas</option>
              {CITIES.map(c => <option key={c.name} value={c.name} style={{ background: C.surface }}>{c.name}</option>)}
            </select>
            <div style={{ fontSize: "12px", color: C.textMut, whiteSpace: "nowrap", flexShrink: 0 }}>{filtered.length} resultado(s)</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 16px", background: C.surface, borderRadius: "12px", border: `1px solid ${C.border}`, color: C.textMut, fontSize: "14px" }}>
                {students.length === 0 ? "Nenhum aluno cadastrado." : "Nenhum resultado encontrado."}
              </div>
            ) : filtered.map(s => (
              <StudentRow key={s.id} student={s} onEdit={handleEdit} onDelete={handleDelete} onTicket={downloadTicket} />
            ))}
          </div>
        </>}

        {/* POR CIDADE */}
        {tab === "cidades" && CITIES.map(city => {
          const cs = students.filter(s => s.city === city.name);
          const cityTotal = cs.reduce((sum, s) => sum + (parseFloat(s.value) || 0), 0);
          return (
            <div key={city.name} style={{ marginBottom: "32px" }}>
              <div className="city-header" style={{ borderBottom: `1px solid ${C.border}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "22px" }}>{city.emoji}</span>
                  <div>
                    <span style={{ fontSize: "16px", fontWeight: "600", color: C.text }}>{city.name}</span>
                    <span style={{ fontSize: "13px", color: C.priL, marginLeft: "10px" }}>{city.date} de 2026</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "13px", color: C.ok, fontWeight: "600" }}>
                    {cityTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </span>
                  <span style={{
                    padding: "4px 12px", background: C.priBg, border: `1px solid ${C.priBo}`,
                    borderRadius: "6px", fontSize: "12px", fontWeight: "600", color: C.priL,
                  }}>{cs.length} inscrito(s)</span>
                </div>
              </div>
              {cs.length === 0 ? (
                <div style={{ textAlign: "center", padding: "32px 16px", background: C.surface, borderRadius: "10px", border: `1px solid ${C.border}`, color: C.textMut, fontSize: "13px" }}>
                  Nenhum inscrito para esta cidade.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {cs.map(s => <StudentRow key={s.id} student={s} onEdit={handleEdit} onDelete={handleDelete} onTicket={downloadTicket} />)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes toastIn { from { transform: translateY(-12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        input:focus, select:focus { border-color: ${C.pri} !important; outline: none; box-shadow: 0 0 0 2px ${C.priBg}; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }
        * { box-sizing: border-box; margin: 0; }

        /* Layout base */
        .app-header {
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
        }
        .header-dates {
          display: flex;
          gap: 14px;
        }
        .nav-btn {
          padding: 9px 14px;
          font-size: 13px;
        }
        .nav-label { display: inline; }
        .page-content {
          padding: 20px;
          max-width: 1000px;
          margin: 0 auto;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        .stat-card {
          border-radius: 12px;
          padding: 18px 20px;
        }
        .cities-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .form-full { grid-column: 1 / -1; }
        .form-actions {
          display: flex;
          gap: 10px;
          margin-top: 20px;
          padding-top: 18px;
        }
        .list-filters {
          display: flex;
          gap: 10px;
          margin-bottom: 14px;
          align-items: center;
          flex-wrap: wrap;
        }
        .city-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
          padding-bottom: 12px;
          flex-wrap: wrap;
          gap: 8px;
        }

        /* Student row */
        .student-row {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr auto;
          align-items: center;
          padding: 14px 16px;
          background: ${C.surface};
          border-radius: 10px;
          border: 1px solid ${C.border};
          gap: 12px;
        }
        .student-actions {
          display: flex;
          gap: 6px;
          justify-content: flex-end;
        }

        /* Tablet: <= 768px */
        @media (max-width: 768px) {
          .app-header { padding: 14px 16px; }
          .header-dates { gap: 10px; font-size: 11px; }
          .page-content { padding: 16px; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .cities-grid { grid-template-columns: 1fr; }
          .student-row {
            grid-template-columns: 1fr auto;
            grid-template-rows: auto auto auto;
          }
          .student-main { grid-column: 1; grid-row: 1; }
          .student-actions { grid-column: 2; grid-row: 1 / 4; align-self: center; }
          .student-city { grid-column: 1; grid-row: 2; }
          .student-value { grid-column: 1; grid-row: 2; display: none; }
          .student-status { grid-column: 1; grid-row: 3; }
        }

        /* Mobile: <= 480px */
        @media (max-width: 480px) {
          .header-dates { display: none; }
          .nav-btn { padding: 8px 10px; font-size: 12px; }
          .page-content { padding: 12px; }
          .stats-grid { grid-template-columns: 1fr 1fr; gap: 8px; }
          .stat-card { padding: 14px 16px; }
          .stat-card div:last-child { font-size: 26px !important; }
          .form-grid { grid-template-columns: 1fr; gap: 14px; }
          .form-full { grid-column: 1; }
          .list-filters { gap: 8px; }
          .city-header { flex-direction: column; align-items: flex-start; }
          .student-row { padding: 12px; gap: 8px; }
        }

        /* Very small: <= 360px */
        @media (max-width: 360px) {
          .nav-label { display: none; }
          .nav-btn { padding: 8px; }
          .stats-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
