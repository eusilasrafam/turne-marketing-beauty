import { useState, useEffect } from "react";
import { supabase } from "./supabase.js";

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
  const logoUrl = `${window.location.origin}/logo-turne.png`;
  const emitDate = new Date().toLocaleDateString("pt-BR");
  const dayOfWeek = city?.dateShort
    ? new Date(`2026-${city.dateShort.split("/")[1]}-${city.dateShort.split("/")[0]}`).toLocaleDateString("pt-BR", { weekday: "long" })
    : "";

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Ingresso — ${student.name}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  @page { size: 210mm 148mm landscape; margin: 0; }
  html, body { width: 210mm; height: 148mm; background: #000; overflow: hidden; }
  @media print {
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    .no-print { display: none !important; }
  }
  body { font-family: 'Inter', system-ui, sans-serif; }

  .ticket {
    width: 210mm; height: 148mm;
    background: #000;
    display: flex;
    overflow: hidden;
    position: relative;
  }

  /* Stub lateral */
  .stub {
    width: 50mm; height: 100%;
    background: #000;
    border-right: 2px dashed #333;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 10mm 0; gap: 0; flex-shrink: 0;
    position: relative;
  }
  .stub-notch {
    position: absolute; width: 22px; height: 22px;
    background: #fff; border-radius: 50%;
    right: -11px;
  }
  .stub-notch.top { top: -4px; }
  .stub-notch.bot { bottom: -4px; }
  .stub-rot {
    writing-mode: vertical-rl;
    text-orientation: mixed;
    transform: rotate(180deg);
    display: flex; flex-direction: column;
    align-items: center; gap: 12px;
    height: 100%; justify-content: center;
  }
  .stub-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 22px; letter-spacing: 4px;
    color: #fff; line-height: 1;
  }
  .stub-sep { width: 1px; height: 18px; background: #333; }
  .stub-sub {
    font-size: 9px; font-weight: 600;
    letter-spacing: 3px; color: #555;
    text-transform: uppercase;
  }
  .stub-date {
    font-size: 10px; font-weight: 700;
    letter-spacing: 2px; color: #888;
  }
  .stub-city {
    font-size: 11px; font-weight: 700;
    letter-spacing: 2px; color: #fff;
  }

  /* Corpo */
  .body {
    flex: 1; padding: 9mm 10mm 7mm 10mm;
    display: flex; flex-direction: column;
    position: relative;
  }
  .corner { position: absolute; width: 18px; height: 18px; }
  .corner.tl { top: 7mm; left: 7mm; border-top: 1px solid #2a2a2a; border-left: 1px solid #2a2a2a; }
  .corner.tr { top: 7mm; right: 7mm; border-top: 1px solid #2a2a2a; border-right: 1px solid #2a2a2a; }
  .corner.bl { bottom: 7mm; left: 7mm; border-bottom: 1px solid #2a2a2a; border-left: 1px solid #2a2a2a; }
  .corner.br { bottom: 7mm; right: 7mm; border-bottom: 1px solid #2a2a2a; border-right: 1px solid #2a2a2a; }

  /* Header */
  .top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 5mm; }
  .logo { height: 30px; filter: brightness(0) invert(1); display: block; }
  .ticket-id { text-align: right; }
  .ticket-id-label { font-size: 7px; font-weight: 600; letter-spacing: 3px; color: #444; text-transform: uppercase; display: block; margin-bottom: 3px; }
  .ticket-id-val { font-family: 'Bebas Neue', monospace; font-size: 13px; letter-spacing: 2px; color: #fff; }

  /* Divisor */
  .divider {
    width: 100%; height: 1px;
    background: linear-gradient(to right, transparent, #2a2a2a, #fff, #2a2a2a, transparent);
    margin-bottom: 4mm;
  }

  /* Participante */
  .part-label {
    font-size: 7px; font-weight: 600; letter-spacing: 3px;
    color: #444; text-transform: uppercase;
    display: flex; align-items: center; gap: 8px; margin-bottom: 3px;
  }
  .part-label::after { content: ''; flex: 1; height: 1px; background: #1a1a1a; }
  .part-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 30px; letter-spacing: 2px;
    color: #fff; line-height: 1; margin-bottom: 3px;
    text-transform: uppercase;
  }
  .part-phone { font-size: 10px; color: #555; letter-spacing: 1px; }

  /* Blocos info */
  .info-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 3mm; margin: 4mm 0; }
  .info-block {
    background: #0d0d0d; border: 1px solid #1f1f1f;
    border-radius: 6px; padding: 3mm 4mm;
  }
  .info-block.hl { border-color: #333; }
  .ib-label { font-size: 7px; font-weight: 600; letter-spacing: 2px; color: #444; text-transform: uppercase; margin-bottom: 3px; }
  .ib-val { font-family: 'Bebas Neue', sans-serif; font-size: 17px; letter-spacing: 1px; color: #fff; line-height: 1.1; }
  .ib-sub { font-size: 8px; color: #555; margin-top: 2px; }

  /* Footer */
  .footer {
    margin-top: auto; padding-top: 3mm;
    border-top: 1px solid #1a1a1a;
    display: flex; align-items: center; justify-content: space-between;
  }
  .footer-id { font-size: 7px; color: #333; font-family: monospace; letter-spacing: 1px; }
  .footer-badge {
    display: flex; align-items: center; gap: 5px;
    font-size: 8px; font-weight: 700; color: #fff;
    letter-spacing: 2px; text-transform: uppercase;
    border: 1px solid #333; padding: 3px 10px; border-radius: 3px;
  }
  .footer-date { font-size: 7px; color: #333; letter-spacing: 1px; }

  /* Botão imprimir (não aparece no PDF) */
  .print-bar {
    position: fixed; bottom: 0; left: 0; right: 0;
    background: #111; padding: 12px 20px;
    display: flex; align-items: center; justify-content: center; gap: 12px;
    font-family: system-ui, sans-serif;
  }
  .btn-print {
    background: #7c3aed; color: #fff; border: none;
    padding: 10px 28px; border-radius: 8px;
    font-size: 13px; font-weight: 600; cursor: pointer; letter-spacing: 0.5px;
  }
  .print-tip { font-size: 11px; color: #666; }
</style>
</head>
<body>

<div class="ticket">
  <!-- STUB -->
  <div class="stub">
    <div class="stub-notch top"></div>
    <div class="stub-notch bot"></div>
    <div class="stub-rot">
      <span class="stub-title">IMERSÃO</span>
      <div class="stub-sep"></div>
      <span class="stub-sub">Marketing & Beauty</span>
      <div class="stub-sep"></div>
      <span class="stub-date">${city?.dateShort || ""}</span>
      <div class="stub-sep"></div>
      <span class="stub-city">${(student.city || "").toUpperCase()}</span>
    </div>
  </div>

  <!-- CORPO -->
  <div class="body">
    <div class="corner tl"></div>
    <div class="corner tr"></div>
    <div class="corner bl"></div>
    <div class="corner br"></div>

    <div class="top">
      <img class="logo" src="${logoUrl}" alt="Logo Imersão" />
      <div class="ticket-id">
        <span class="ticket-id-label">Nº do ingresso</span>
        <div class="ticket-id-val">${student.id.toUpperCase()}</div>
      </div>
    </div>

    <div class="divider"></div>

    <div class="part-label">Participante</div>
    <div class="part-name">${student.name}</div>
    <div class="part-phone">${student.phone}</div>

    <div class="info-grid">
      <div class="info-block hl">
        <div class="ib-label">Cidade</div>
        <div class="ib-val">${student.city}</div>
        <div class="ib-sub">Brasil · 2026</div>
      </div>
      <div class="info-block">
        <div class="ib-label">Data</div>
        <div class="ib-val">${city?.date || "—"}</div>
        <div class="ib-sub">${dayOfWeek}</div>
      </div>
      <div class="info-block">
        <div class="ib-label">Valor pago</div>
        <div class="ib-val">${valStr}</div>
        <div class="ib-sub">${student.paymentMethod}</div>
      </div>
    </div>

    <div class="footer">
      <div class="footer-id">ID: ${student.id.toUpperCase()} · Cadastro: ${formatDate(student.registrationDate)}</div>
      <div class="footer-badge">
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6 9 17l-5-5"/></svg>
        PAGAMENTO CONFIRMADO
      </div>
      <div class="footer-date">Emitido em ${emitDate}</div>
    </div>
  </div>
</div>

<!-- Barra de impressão (some no PDF) -->
<div class="print-bar no-print">
  <span class="print-tip">💡 No diálogo de impressão: margens = Nenhuma · ative "Gráficos de fundo"</span>
  <button class="btn-print" onclick="window.print()">Salvar como PDF</button>
</div>

<script>
  // Aguarda a logo carregar antes de disparar o print automaticamente
  const img = document.querySelector('.logo');
  const doPrint = () => setTimeout(() => window.print(), 400);
  if (img.complete) doPrint();
  else img.addEventListener('load', doPrint);
</script>
</body>
</html>`;

  const win = window.open("", "_blank");
  win.document.write(html);
  win.document.close();
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
        {!isPaid && student.pendingValue ? (
          <div style={{ fontSize: "11px", color: C.warn, fontWeight: "500" }}>saldo: {formatCurrency(student.pendingValue)}</div>
        ) : (
          <div style={{ fontSize: "11px", color: C.textMut }}>{student.paymentMethod}</div>
        )}
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

const studentToDb = (s) => ({
  id: s.id,
  name: s.name,
  phone: s.phone,
  city: s.city,
  payment_method: s.paymentMethod,
  payment_status: s.paymentStatus,
  registration_date: s.registrationDate,
  payment_date: s.paymentDate,
  value: s.value,
  pending_value: s.pendingValue,
});

const dbToStudent = (r) => ({
  id: r.id,
  name: r.name,
  phone: r.phone,
  city: r.city,
  paymentMethod: r.payment_method,
  paymentStatus: r.payment_status,
  registrationDate: r.registration_date,
  paymentDate: r.payment_date,
  value: r.value,
  pendingValue: r.pending_value,
});

export default function App({ onLogout }) {
  const [students, setStudents] = useState([]);
  const [dbLoading, setDbLoading] = useState(true);
  const [tab, setTab] = useState("dashboard");
  const [editingId, setEditingId] = useState(null);
  const [filterCity, setFilterCity] = useState("Todas");
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({
    name: "", phone: "", city: CITIES[0].name,
    paymentMethod: PAYMENT_METHODS[0], paymentStatus: "Pendente",
    registrationDate: today(), paymentDate: "", value: "", pendingValue: "",
  });

  useEffect(() => {
    supabase
      .from("turne_students")
      .select("*")
      .order("created_at", { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setStudents(data.map(dbToStudent));
        setDbLoading(false);
      });
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const resetForm = () => {
    setForm({ name: "", phone: "", city: CITIES[0].name, paymentMethod: PAYMENT_METHODS[0], paymentStatus: "Pendente", registrationDate: today(), paymentDate: "", value: "", pendingValue: "" });
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.phone.trim()) { showToast("Preencha nome e telefone!", "error"); return; }
    if (editingId) {
      const { error } = await supabase
        .from("turne_students")
        .update(studentToDb(form))
        .eq("id", editingId);
      if (error) { showToast("Erro ao salvar.", "error"); return; }
      setStudents(p => p.map(s => s.id === editingId ? { ...form, id: editingId } : s));
      showToast("Cadastro atualizado!");
    } else {
      const newStudent = { ...form, id: generateId() };
      const { error } = await supabase
        .from("turne_students")
        .insert(studentToDb(newStudent));
      if (error) { showToast("Erro ao cadastrar.", "error"); return; }
      setStudents(p => [...p, newStudent]);
      showToast("Aluno cadastrado!");
    }
    resetForm();
  };

  const handleEdit = (s) => { setForm({ ...s }); setEditingId(s.id); setTab("cadastro"); };
  const handleDelete = async (id) => {
    if (!window.confirm("Excluir este cadastro?")) return;
    const { error } = await supabase.from("turne_students").delete().eq("id", id);
    if (error) { showToast("Erro ao excluir.", "error"); return; }
    setStudents(p => p.filter(s => s.id !== id));
    showToast("Removido.", "error");
  };

  const filtered = students.filter(s => {
    const mc = filterCity === "Todas" || s.city === filterCity;
    const ms = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.phone.includes(searchTerm);
    return mc && ms;
  });

  const totalPaid = students.filter(s => s.paymentStatus === "Finalizado").length;
  const totalSales = students.reduce((sum, s) => sum + (parseFloat(s.value) || 0), 0);
  const totalPaidSales = students.filter(s => s.paymentStatus === "Finalizado").reduce((sum, s) => sum + (parseFloat(s.value) || 0), 0);
  const totalPendingSales = students.filter(s => s.paymentStatus !== "Finalizado").reduce((sum, s) => sum + (parseFloat(s.pendingValue) || 0), 0);

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

  if (dbLoading) return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, fontFamily: "system-ui, sans-serif" }}>
      <div style={{ width: 40, height: 40, border: `3px solid ${C.border}`, borderTopColor: C.pri, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <div style={{ fontSize: 13, color: C.textMut }}>Carregando dados...</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

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
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div className="header-dates" style={{ fontSize: "12px", color: C.textMut }}>
            <span>Parauapebas · 14/06</span>
            <span>Marabá · 17/06</span>
            <span>Teresina · 29/06</span>
          </div>
          {onLogout && (
            <button onClick={onLogout} title="Sair" style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "6px 12px", borderRadius: "7px",
              border: `1px solid ${C.border}`, background: "transparent",
              color: C.textMut, cursor: "pointer", fontSize: "12px",
              fontFamily: "system-ui, sans-serif", whiteSpace: "nowrap",
              transition: "color 0.15s, border-color 0.15s",
            }}>
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Sair
            </button>
          )}
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
              {form.paymentStatus === "Pendente" && (
                <div>
                  <label style={lbl}>Valor do saldo pendente (R$)</label>
                  <input style={{ ...inp, borderColor: C.warnBo, boxShadow: `0 0 0 1px ${C.warnBo}` }}
                    placeholder="Ex: 97,00" type="number" step="0.01" min="0"
                    value={form.pendingValue}
                    onChange={e => setForm(f => ({ ...f, pendingValue: e.target.value }))} />
                </div>
              )}
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
