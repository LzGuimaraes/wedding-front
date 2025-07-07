"use client";

import { useState, FormEvent, useEffect, useCallback } from "react";

interface FormData {
  fullName: string;
  email: string;
  message: string;
}

interface Guest {
  full_name: string;
  is_confirmed: boolean;
}

export default function ConfirmarPresencaPage() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    message: "",
  });
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedGuests, setConfirmedGuests] = useState<Guest[]>([]);
  const [unconfirmedGuests, setUnconfirmedGuests] = useState<Guest[]>([]);
  const [isLoadingGuests, setIsLoadingGuests] = useState(true);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

  const fetchAllGuests = useCallback(async () => {
    setIsLoadingGuests(true);
    try {
      const confirmedResponse = await fetch(
        `${API_BASE_URL}/api/guests/confirmed`
      );
      if (confirmedResponse.ok) {
        const confirmedData: Guest[] = await confirmedResponse.json();
        setConfirmedGuests(confirmedData);
      }

      const unconfirmedResponse = await fetch(
        `${API_BASE_URL}/api/guests/unconfirmed`
      );
      if (unconfirmedResponse.ok) {
        const unconfirmedData: Guest[] = await unconfirmedResponse.json();
        setUnconfirmedGuests(unconfirmedData);
      }
    } catch (error: unknown) {
      console.error("Erro ao buscar convidados:", error);
      setConfirmedGuests([]);
      setUnconfirmedGuests([]);
    } finally {
      setIsLoadingGuests(false);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    fetchAllGuests();
  }, [fetchAllGuests]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const filterGuestsBySearch = (guests: Guest[]) => {
    if (!searchTerm.trim()) return guests;
    return guests.filter((guest) =>
      guest.full_name.toLowerCase().includes(searchTerm.toLowerCase().trim())
    );
  };

  const filteredConfirmedGuests = filterGuestsBySearch(confirmedGuests);
  const filteredUnconfirmedGuests = filterGuestsBySearch(unconfirmedGuests);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmissionStatus("loading");
    setErrorMessage(null);

    if (!formData.fullName.trim()) {
      setErrorMessage("Por favor, preencha o nome completo.");
      setSubmissionStatus("error");
      return;
    }

    if (!formData.email.trim()) {
      setErrorMessage("Por favor, preencha o e-mail.");
      setSubmissionStatus("error");
      return;
    }

    if (!validateEmail(formData.email)) {
      setErrorMessage("Por favor, insira um e-mail válido.");
      setSubmissionStatus("error");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/guests/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          numCompanions: 0,
        }),
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          const errorText = await response.text();
          throw new Error(`Erro ${response.status}: ${errorText}`);
        }
        throw new Error(
          errorData.error || `Erro HTTP! Status: ${response.status}`
        );
      }

      setSubmissionStatus("success");
      setFormData({ fullName: "", email: "", message: "" });
      fetchAllGuests();
      alert("Sua presença foi confirmada com sucesso!");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Erro ao confirmar presença:", error);
        setErrorMessage(`Falha na confirmação: ${error.message}`);
      } else {
        setErrorMessage("Falha na confirmação: erro desconhecido.");
      }
      setSubmissionStatus("error");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #fdf2f8 0%, #f8fafc 50%, #f1f5f9 100%)",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        padding: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          padding: "0",
        }}
      >
        {/* Header Section */}
        <div
          style={{
            background: "linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)",
            borderRadius: "20px 20px 0 0",
            padding: "40px 30px",
            textAlign: "center",
            color: "white",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-50px",
              right: "-50px",
              width: "100px",
              height: "100px",
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "50%",
              animation: "float 3s ease-in-out infinite",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-30px",
              left: "-30px",
              width: "60px",
              height: "60px",
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "50%",
              animation: "float 2s ease-in-out infinite reverse",
            }}
          />
          <h1
            style={{
              fontSize: "2.5em",
              marginBottom: "10px",
              fontWeight: "700",
              letterSpacing: "-0.02em",
              textShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
          >
            💕 Confirmar Presença
          </h1>
          <p
            style={{
              fontSize: "1.1em",
              opacity: "0.95",
              fontWeight: "400",
              lineHeight: "1.5",
            }}
          >
            Confirme sua presença em nossa celebração especial
          </p>
        </div>

        {/* Main Form Section */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "0 0 20px 20px",
            padding: "40px 30px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
            position: "relative",
          }}
        >
          {/* Status Messages */}
          {submissionStatus === "loading" && (
            <div
              style={{
                padding: "15px 20px",
                backgroundColor: "#dbeafe",
                color: "#1e40af",
                borderRadius: "12px",
                marginBottom: "25px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "0.95em",
                fontWeight: "500",
              }}
            >
              <div style={{ animation: "spin 1s linear infinite" }}>⏳</div>
              Enviando confirmação...
            </div>
          )}

          {errorMessage && (
            <div
              style={{
                padding: "15px 20px",
                backgroundColor: "#fee2e2",
                color: "#dc2626",
                borderRadius: "12px",
                marginBottom: "25px",
                fontSize: "0.95em",
                fontWeight: "500",
                border: "1px solid #fecaca",
              }}
            >
              ❌ {errorMessage}
            </div>
          )}

          {submissionStatus === "success" && !errorMessage && (
            <div
              style={{
                padding: "15px 20px",
                backgroundColor: "#dcfce7",
                color: "#16a34a",
                borderRadius: "12px",
                marginBottom: "25px",
                fontSize: "0.95em",
                fontWeight: "500",
                border: "1px solid #bbf7d0",
              }}
            >
              ✅ Presença confirmada com sucesso!
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "25px" }}
          >
            <div>
              <label
                htmlFor="fullName"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#374151",
                  fontSize: "0.95em",
                }}
              >
                Nome Completo <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "15px 18px",
                  borderRadius: "12px",
                  border: "2px solid #e5e7eb",
                  fontSize: "1em",
                  transition: "all 0.3s ease",
                  outline: "none",
                  backgroundColor: "#fafafa",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#ec4899";
                  e.currentTarget.style.backgroundColor = "white";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(236, 72, 153, 0.1)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#e5e7eb";
                  e.currentTarget.style.backgroundColor = "#fafafa";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#374151",
                  fontSize: "0.95em",
                }}
              >
                E-mail <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "15px 18px",
                  borderRadius: "12px",
                  border: "2px solid #e5e7eb",
                  fontSize: "1em",
                  transition: "all 0.3s ease",
                  outline: "none",
                  backgroundColor: "#fafafa",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#ec4899";
                  e.currentTarget.style.backgroundColor = "white";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(236, 72, 153, 0.1)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#e5e7eb";
                  e.currentTarget.style.backgroundColor = "#fafafa";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            <div>
              <label
                htmlFor="message"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#374151",
                  fontSize: "0.95em",
                }}
              >
                Sua Mensagem (opcional)
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                placeholder="Deixe uma mensagem carinhosa para os noivos..."
                style={{
                  width: "100%",
                  padding: "15px 18px",
                  borderRadius: "12px",
                  border: "2px solid #e5e7eb",
                  fontSize: "1em",
                  resize: "vertical",
                  transition: "all 0.3s ease",
                  outline: "none",
                  backgroundColor: "#fafafa",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#ec4899";
                  e.currentTarget.style.backgroundColor = "white";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(236, 72, 153, 0.1)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#e5e7eb";
                  e.currentTarget.style.backgroundColor = "#fafafa";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            <button
              type="submit"
              disabled={submissionStatus === "loading"}
              style={{
                padding: "18px 30px",
                background: submissionStatus === "loading" 
                  ? "linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)"
                  : "linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)",
                color: "white",
                border: "none",
                borderRadius: "12px",
                cursor: submissionStatus === "loading" ? "not-allowed" : "pointer",
                fontSize: "1.1em",
                fontWeight: "600",
                transition: "all 0.3s ease",
                transform: "translateY(0)",
                boxShadow: "0 4px 15px rgba(236, 72, 153, 0.3)",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                if (submissionStatus !== "loading") {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 25px rgba(236, 72, 153, 0.4)";
                }
              }}
              onMouseLeave={(e) => {
                if (submissionStatus !== "loading") {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 15px rgba(236, 72, 153, 0.3)";
                }
              }}
            >
              {submissionStatus === "loading" ? "Enviando..." : "Confirmar Presença 💕"}
            </button>
          </form>
        </div>

        {/* Guest List Section */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "20px",
            padding: "40px 30px",
            marginTop: "30px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          }}
        >
          <h2
            style={{
              background: "linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: "2em",
              textAlign: "center",
              marginBottom: "30px",
              fontWeight: "700",
            }}
          >
            Lista de Convidados
          </h2>

          {/* Search Bar */}
          <div style={{ marginBottom: "30px" }}>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Pesquisar convidados..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: "15px 50px 15px 18px",
                  borderRadius: "25px",
                  border: "2px solid #e5e7eb",
                  fontSize: "1em",
                  outline: "none",
                  transition: "all 0.3s ease",
                  backgroundColor: "#fafafa",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#ec4899";
                  e.currentTarget.style.backgroundColor = "white";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(236, 72, 153, 0.1)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#e5e7eb";
                  e.currentTarget.style.backgroundColor = "#fafafa";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
              <div
                style={{
                  position: "absolute",
                  right: "20px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "1.2em",
                  color: "#9ca3af",
                }}
              >
                🔍
              </div>
            </div>
          </div>

          {isLoadingGuests ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px",
                color: "#6b7280",
                fontSize: "1.1em",
              }}
            >
              <div style={{ animation: "spin 1s linear infinite", marginBottom: "10px" }}>
                ⏳
              </div>
              Carregando lista...
            </div>
          ) : (
            <div style={{ display: "grid", gap: "25px" }}>
              {/* Confirmed Guests */}
              <div>
                <h3
                  style={{
                    color: "#16a34a",
                    marginBottom: "15px",
                    fontSize: "1.3em",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span style={{ fontSize: "1.2em" }}>✅</span>
                  Confirmados ({filteredConfirmedGuests.length}/{confirmedGuests.length})
                </h3>
                <div
                  style={{
                    maxHeight: "300px",
                    overflowY: "auto",
                    borderRadius: "15px",
                    border: "2px solid #dcfce7",
                    backgroundColor: "#f0fdf4",
                    padding: "5px",
                  }}
                >
                  {filteredConfirmedGuests.length === 0 ? (
                    <p
                      style={{
                        textAlign: "center",
                        color: "#6b7280",
                        margin: "30px 0",
                        fontSize: "1em",
                      }}
                    >
                      {searchTerm
                        ? "Nenhum convidado confirmado encontrado."
                        : "Nenhum convidado confirmado ainda."}
                    </p>
                  ) : (
                    <div style={{ padding: "10px" }}>
                      {filteredConfirmedGuests.map((guest, index) => (
                        <div
                          key={index}
                          style={{
                            padding: "15px 20px",
                            backgroundColor: "white",
                            borderRadius: "10px",
                            marginBottom: "8px",
                            fontSize: "1.05em",
                            color: "#374151",
                            fontWeight: "500",
                            transition: "all 0.2s ease",
                            border: "1px solid #e5e7eb",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateX(5px)";
                            e.currentTarget.style.boxShadow = "0 4px 15px rgba(22, 163, 74, 0.15)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateX(0)";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        >
                          {guest.full_name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Unconfirmed Guests */}
              <div>
                <h3
                  style={{
                    color: "#f59e0b",
                    marginBottom: "15px",
                    fontSize: "1.3em",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span style={{ fontSize: "1.2em" }}>⏳</span>
                  Aguardando Confirmação ({filteredUnconfirmedGuests.length}/{unconfirmedGuests.length})
                </h3>
                <div
                  style={{
                    maxHeight: "300px",
                    overflowY: "auto",
                    borderRadius: "15px",
                    border: "2px solid #fed7aa",
                    backgroundColor: "#fffbeb",
                    padding: "5px",
                  }}
                >
                  {filteredUnconfirmedGuests.length === 0 ? (
                    <p
                      style={{
                        textAlign: "center",
                        color: "#6b7280",
                        margin: "30px 0",
                        fontSize: "1em",
                      }}
                    >
                      {searchTerm
                        ? "Nenhum convidado não confirmado encontrado."
                        : "Todos os convidados já confirmaram! 🎉"}
                    </p>
                  ) : (
                    <div style={{ padding: "10px" }}>
                      {filteredUnconfirmedGuests.map((guest, index) => (
                        <div
                          key={index}
                          style={{
                            padding: "15px 20px",
                            backgroundColor: "white",
                            borderRadius: "10px",
                            marginBottom: "8px",
                            fontSize: "1.05em",
                            color: "#9ca3af",
                            fontWeight: "500",
                            fontStyle: "italic",
                            transition: "all 0.2s ease",
                            border: "1px solid #e5e7eb",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateX(5px)";
                            e.currentTarget.style.boxShadow = "0 4px 15px rgba(245, 158, 11, 0.15)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateX(0)";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        >
                          {guest.full_name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>


    </div>
  );
}