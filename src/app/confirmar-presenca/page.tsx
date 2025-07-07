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

  // Constantes para cores usadas na estilização
  const borderColorDefault = "var(--color-light-gray)";
  const borderColorFocus = "var(--color-pink-soft)";
  const boxShadowFocus = "0 0 6px 2px rgba(255, 192, 203, 0.4)";

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "50px auto",
        padding: "20px",
        backgroundColor: "var(--color-white)",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        fontFamily: "inherit",
        color: "var(--color-dark-gray)",
      }}
    >
      <h1
        style={{
          color: "var(--color-deep-rose)",
          fontSize: "2em",
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        Confirmar Presença
      </h1>
      <p style={{ textAlign: "center", marginBottom: "30px" }}>
        Por favor, preencha o formulário abaixo para confirmar sua presença no
        nosso casamento.
      </p>

      {submissionStatus === "loading" && (
        <p style={{ color: "blue", textAlign: "center" }}>
          Enviando confirmação...
        </p>
      )}
      {errorMessage && (
        <p style={{ color: "red", textAlign: "center" }}>{errorMessage}</p>
      )}
      {submissionStatus === "success" && !errorMessage && (
        <p style={{ color: "green", textAlign: "center" }}>
          Presença confirmada com sucesso!
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        <div>
          <label
            htmlFor="fullName"
            style={{ display: "block", marginBottom: "5px" }}
          >
            Nome Completo: <span style={{ color: "red" }}>*</span>
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
              padding: "10px",
              borderRadius: "5px",
              border: `1.8px solid ${borderColorDefault}`,
              transition: "border-color 0.3s ease, box-shadow 0.3s ease",
              outline: "none",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = borderColorFocus;
              e.currentTarget.style.boxShadow = boxShadowFocus;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = borderColorDefault;
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>
        <div>
          <label
            htmlFor="email"
            style={{ display: "block", marginBottom: "5px" }}
          >
            E-mail: <span style={{ color: "red" }}>*</span>
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
              padding: "10px",
              borderRadius: "5px",
              border: `1.8px solid ${borderColorDefault}`,
              transition: "border-color 0.3s ease, box-shadow 0.3s ease",
              outline: "none",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = borderColorFocus;
              e.currentTarget.style.boxShadow = boxShadowFocus;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = borderColorDefault;
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>
        <div>
          <label
            htmlFor="message"
            style={{ display: "block", marginBottom: "5px" }}
          >
            Sua Mensagem (opcional):
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: `1.8px solid ${borderColorDefault}`,
              resize: "vertical",
              transition: "border-color 0.3s ease, box-shadow 0.3s ease",
              outline: "none",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = borderColorFocus;
              e.currentTarget.style.boxShadow = boxShadowFocus;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = borderColorDefault;
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>
        <button
          type="submit"
          disabled={submissionStatus === "loading"}
          style={{
            padding: "12px 20px",
            backgroundColor: "var(--color-pink-soft)",
            color: "var(--color-white)",
            border: "none",
            borderRadius: "5px",
            cursor: submissionStatus === "loading" ? "not-allowed" : "pointer",
            fontSize: "1.1em",
            fontWeight: "bold",
            transition: "all 0.3s ease",
            transform: "translateY(0)",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
          onMouseEnter={(e) => {
            if (submissionStatus !== "loading") {
              e.currentTarget.style.backgroundColor = "var(--color-deep-rose)";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
            }
          }}
          onMouseLeave={(e) => {
            if (submissionStatus !== "loading") {
              e.currentTarget.style.backgroundColor = "var(--color-pink-soft)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
            }
          }}
        >
          {submissionStatus === "loading"
            ? "Enviando..."
            : "Confirmar Presença"}
        </button>
      </form>

      <div style={{ marginTop: "40px" }}>
        <h2
          style={{
            color: "var(--color-deep-rose)",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          Lista de Convidados
        </h2>

        {/* Barra de Pesquisa */}
        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="🔍 Pesquisar por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 15px",
              borderRadius: "25px",
              border: `1.8px solid ${borderColorDefault}`,
              fontSize: "1em",
              outline: "none",
              transition: "border-color 0.3s ease, box-shadow 0.3s ease",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = borderColorFocus;
              e.currentTarget.style.boxShadow = boxShadowFocus;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = borderColorDefault;
              e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";
            }}
          />
        </div>

        {isLoadingGuests ? (
          <p style={{ textAlign: "center" }}>Carregando lista...</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Convidados Confirmados */}
            <div>
              <h3
                style={{
                  color: "var(--color-deep-rose)",
                  marginBottom: "10px",
                  fontSize: "1.2em",
                }}
              >
                ✅ Confirmados ({filteredConfirmedGuests.length}/
                {confirmedGuests.length})
              </h3>
              <div
                style={{
                  maxHeight: "200px",
                  overflowY: "auto",
                  border: `1.8px solid ${borderColorDefault}`,
                  borderRadius: "8px",
                  backgroundColor: "#f9f9f9",
                  padding: "10px",
                }}
              >
                {filteredConfirmedGuests.length === 0 ? (
                  <p
                    style={{
                      textAlign: "center",
                      color: borderColorDefault,
                      margin: "20px 0",
                    }}
                  >
                    {searchTerm
                      ? "Nenhum convidado confirmado encontrado."
                      : "Nenhum convidado confirmado ainda."}
                  </p>
                ) : (
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {filteredConfirmedGuests.map((guest, index) => (
                      <li
                        key={index}
                        style={{
                          padding: "12px 15px",
                          borderBottom:
                            index < filteredConfirmedGuests.length - 1
                              ? `1px dashed ${borderColorDefault}`
                              : "none",
                          fontSize: "1.1em",
                          color: "var(--color-dark-gray)",
                          backgroundColor: "white",
                          margin: "2px 0",
                          borderRadius: "4px",
                          transition: "background-color 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#f0f8ff";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "white";
                        }}
                      >
                        {guest.full_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Convidados Não Confirmados */}
            <div>
              <h3
                style={{
                  color: "var(--color-deep-rose)",
                  marginBottom: "10px",
                  fontSize: "1.2em",
                }}
              >
                ⏳ Aguardando Confirmação ({filteredUnconfirmedGuests.length}/
                {unconfirmedGuests.length})
              </h3>
              <div
                style={{
                  maxHeight: "200px",
                  overflowY: "auto",
                  border: `1.8px solid ${borderColorDefault}`,
                  borderRadius: "8px",
                  backgroundColor: "#f9f9f9",
                  padding: "10px",
                }}
              >
                {filteredUnconfirmedGuests.length === 0 ? (
                  <p
                    style={{
                      textAlign: "center",
                      color: borderColorDefault,
                      margin: "20px 0",
                    }}
                  >
                    {searchTerm
                      ? "Nenhum convidado não confirmado encontrado."
                      : "Todos os convidados já confirmaram!"}
                  </p>
                ) : (
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {filteredUnconfirmedGuests.map((guest, index) => (
                      <li
                        key={index}
                        style={{
                          padding: "12px 15px",
                          borderBottom:
                            index < filteredUnconfirmedGuests.length - 1
                              ? `1px dashed ${borderColorDefault}`
                              : "none",
                          fontSize: "1.1em",
                          color: "#999",
                          fontStyle: "italic",
                          backgroundColor: "white",
                          margin: "2px 0",
                          borderRadius: "4px",
                          transition: "background-color 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#fff8f0";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "white";
                        }}
                      >
                        {guest.full_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
