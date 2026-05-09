import { useState } from "react";

const CREDENTIALS = { login: "admin", password: "turne2026" };

const C = {
  bg: "#06090F",
  card: "#0f172a",
  border: "rgba(255,255,255,0.06)",
  borderStrong: "rgba(255,255,255,0.1)",
  text: "#F0F4F8",
  textSec: "#8899AA",
  input: "#0C1220",
  inputBorder: "rgba(255,255,255,0.08)",
  pri: "#7c3aed",
  priHover: "#6d28d9",
  err: "#F87171",
  errBg: "rgba(248,113,113,0.08)",
  errBorder: "rgba(248,113,113,0.2)",
};

export default function Login({ onLogin }) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      if (login === CREDENTIALS.login && password === CREDENTIALS.password) {
        localStorage.setItem("turne_auth", "1");
        onLogin();
      } else {
        setError("Login ou senha inválidos.");
      }
      setLoading(false);
    }, 600);
  };

  const inp = {
    width: "100%",
    backgroundColor: C.input,
    border: `1px solid ${C.inputBorder}`,
    borderRadius: 10,
    padding: "10px 12px",
    color: C.text,
    fontSize: 13,
    outline: "none",
    fontFamily: "system-ui, -apple-system, sans-serif",
    boxSizing: "border-box",
    transition: "border-color 0.15s",
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
      backgroundColor: C.bg,
      fontFamily: "system-ui, -apple-system, sans-serif",
    }}>
      <div style={{ width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", gap: 28 }}>

        {/* Logo */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 52, height: 52,
            background: `linear-gradient(135deg, ${C.pri}, #a78bfa)`,
            borderRadius: 14,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, fontSize: 22, color: "#fff",
            boxShadow: `0 8px 32px rgba(124,58,237,0.35)`,
          }}>T</div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.text, letterSpacing: "0.02em" }}>
              Turnê Marketing & Beauty
            </div>
            <div style={{ fontSize: 10, letterSpacing: "0.14em", color: "#4A5A6B", textTransform: "uppercase", fontWeight: 500, marginTop: 2 }}>
              Sistema de Cadastro · 2026
            </div>
          </div>
        </div>

        {/* Card */}
        <div style={{
          backgroundColor: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 16,
          padding: 28,
        }}>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: C.text, margin: 0, marginBottom: 5 }}>
            Acesso restrito
          </h1>
          <p style={{ fontSize: 12, color: C.textSec, margin: 0, marginBottom: 24 }}>
            Entre com suas credenciais para continuar
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Login */}
            <div>
              <label style={{
                fontSize: 11, color: C.textSec, display: "block",
                marginBottom: 6, fontWeight: 500,
                textTransform: "uppercase", letterSpacing: "0.06em",
              }}>Login</label>
              <input
                type="text"
                value={login}
                onChange={e => { setLogin(e.target.value); setError(""); }}
                placeholder="admin"
                required
                autoFocus
                style={inp}
              />
            </div>

            {/* Senha */}
            <div>
              <label style={{
                fontSize: 11, color: C.textSec, display: "block",
                marginBottom: 6, fontWeight: 500,
                textTransform: "uppercase", letterSpacing: "0.06em",
              }}>Senha</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(""); }}
                  placeholder="••••••••"
                  required
                  style={{ ...inp, paddingRight: 40 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  style={{
                    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer", color: C.textSec,
                    padding: 0, display: "flex", alignItems: "center",
                  }}
                >
                  {showPassword ? (
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Erro */}
            {error && (
              <div style={{
                fontSize: 12, color: C.err,
                backgroundColor: C.errBg,
                padding: "8px 10px", borderRadius: 8,
                border: `1px solid ${C.errBorder}`,
              }}>
                {error}
              </div>
            )}

            {/* Botão */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                backgroundColor: loading ? "#5b21b6" : C.pri,
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "11px 0",
                fontSize: 13,
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                marginTop: 4,
                fontFamily: "system-ui, sans-serif",
                transition: "background-color 0.15s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              {loading ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "spin 0.8s linear infinite" }}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  Verificando...
                </>
              ) : "Entrar"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: "#2d3a4a", margin: 0 }}>
          Turnê Marketing & Beauty · Acesso administrativo
        </p>
      </div>

      <style>{`
        * { box-sizing: border-box; margin: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        input:focus { border-color: #7c3aed !important; box-shadow: 0 0 0 2px rgba(124,58,237,0.15) !important; outline: none; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
      `}</style>
    </div>
  );
}
