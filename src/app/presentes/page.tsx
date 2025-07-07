"use client";

import { useState, useEffect } from "react";

interface Gift {
  id: number;
  name: string;
  price: number;
  status: "available" | "reserved" | "purchased";
  guest_id?: number;
}

interface Guest {
  id: number;
  name: string;
  email?: string;
}

interface GuestApiResponse {
  id: number;
  full_name: string;
  email?: string;
}

export default function ListaPresentes() {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isLoadingGifts, setIsLoadingGifts] = useState(true);
  const [isLoadingGuests, setIsLoadingGuests] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [selectedGuestId, setSelectedGuestId] = useState<number | "">("");
  const [reserveStatus, setReserveStatus] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

  const fetchGifts = async () => {
    setIsLoadingGifts(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/gifts`);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data: Gift[] = await response.json();
      setGifts(data);
    } catch (error: unknown) {
      const err = error as Error;
      console.error("Erro:", err.message);
      setErrorMessage(err.message);
    } finally {
      setIsLoadingGifts(false);
    }
  };

  const fetchGuests = async () => {
    setIsLoadingGuests(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/guests/confirmed`);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data: GuestApiResponse[] = await response.json();
      const validGuests = data
        .map((guest) => ({
          id: guest.id,
          name: guest.full_name,
          email: guest.email,
        }))
        .filter((guest) => guest.id && guest.name.trim().length > 0);

      setGuests(validGuests);
    } catch (error: unknown) {
      const err = error as Error;
      console.error("Erro ao buscar convidados:", err);
      setErrorMessage("Erro ao carregar convidados. Tente novamente.");
      setGuests([]);
    } finally {
      setIsLoadingGuests(false);
    }
  };

  useEffect(() => {
    fetchGifts();
    fetchGuests();
  }, []);

  const filterGiftsBySearch = (gifts: Gift[]) => {
    if (!searchTerm.trim()) return gifts;
    return gifts.filter((gift) =>
      gift.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
    );
  };

  const getGiftsByStatus = (status: Gift["status"]) =>
    filterGiftsBySearch(gifts.filter((gift) => gift.status === status));

  const availableGifts = getGiftsByStatus("available");
  const reservedGifts = getGiftsByStatus("reserved");
  const purchasedGifts = getGiftsByStatus("purchased");

  const handleReserveGift = async () => {
    if (!selectedGift || selectedGuestId === "") {
      setErrorMessage("Por favor, selecione um convidado.");
      return;
    }

    setReserveStatus("loading");
    setErrorMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/gifts/reserve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          giftId: selectedGift.id,
          guestId: selectedGuestId,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }

      setReserveStatus("success");
      setShowReserveModal(false);
      setSelectedGift(null);
      setSelectedGuestId("");
      fetchGifts();
      alert("Presente reservado com sucesso!");
    } catch (error: unknown) {
      const err = error as Error;
      console.error("Erro ao reservar presente:", err);
      setErrorMessage(`Falha na reserva: ${err.message}`);
      setReserveStatus("error");
    }
  };

  const handleConfirmPurchase = async (gift: Gift) => {
    if (!gift.guest_id || gift.guest_id <= 0) {
      alert("Erro: Presente não possui convidado válido associado.");
      return;
    }

    if (!confirm(`Confirmar compra do presente "${gift.name}"?`)) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/gifts/purchase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          giftId: gift.id,
          guestId: gift.guest_id,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }

      fetchGifts();
      alert("Compra confirmada com sucesso!");
    } catch (error: unknown) {
      const err = error as Error;
      console.error("Erro ao confirmar compra:", err);
      alert(`Falha na confirmação: ${err.message}`);
    }
  };

  const formatPrice = (price?: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price ?? 0);

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "50px auto",
        padding: "30px",
        borderRadius: "20px",
        background: "linear-gradient(135deg, #fff0f5, #fbe7ef)",
        boxShadow: "0 8px 24px rgba(255, 192, 203, 0.4)",
        fontFamily: "'Times New Roman', serif",
        color: "var(--color-pink-deep)",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          fontSize: "2.4em",
          marginBottom: "10px",
        }}
      >
        🎁 Lista de Presentes
      </h1>

      <p
        style={{
          textAlign: "center",
          marginBottom: "30px",
          fontSize: "1.1em",
          color: "var(--color-pink-deep)",
        }}
      >
        Escolha um presente para reservar ou confirme a compra dos presentes já
        reservados.
      </p>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="🔍 Pesquisar presentes..."
        style={{
          width: "100%",
          padding: "12px 18px",
          marginBottom: "30px",
          borderRadius: "30px",
          border: "2px solid #f8c8dc",
          outline: "none",
          fontSize: "1em",
          boxShadow: "0 2px 4px rgba(248, 200, 220, 0.4)",
          transition: "all 0.3s ease",
          color: "var(--color-pink-deep)",
        }}
      />

      <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
        {[{
          title: "Disponíveis",
          icon: "🎁",
          data: availableGifts,
          color: "#fff5fa",
          hoverColor: "#ffe6f2",
        }, {
          title: "Reservados",
          icon: "⏳",
          data: reservedGifts,
          color: "#fff9f0",
          hoverColor: "#fff0d6",
        }, {
          title: "Comprados",
          icon: "✅",
          data: purchasedGifts,
          color: "#f0fff7",
          hoverColor: "#d6fff0",
        }].map(({ title, icon, data, color, hoverColor }) => (
          <div
            key={title}
            style={{
              backgroundColor: color,
              borderRadius: "15px",
              padding: "20px",
              flex: "1 1 280px",
              maxHeight: "400px",
              overflowY: "auto",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h2
              style={{
                color: "var(--color-pink-deep)",
                fontSize: "1.4em",
                marginBottom: "15px",
                textAlign: "center",
              }}
            >
              {icon} {title} ({data.length})
            </h2>

            {data.length === 0 ? (
              <p style={{ color: "#aaa", textAlign: "center", marginTop: "auto" }}>
                Nenhum presente nesta categoria.
              </p>
            ) : (
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                  gap: "15px",
                  flexGrow: 1,
                  overflowY: "auto",
                }}
              >
                {data.map((gift) => (
                  <li
                    key={gift.id}
                    style={{
                      background: "white",
                      borderRadius: "10px",
                      padding: "15px 20px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "default",
                      transition: "background-color 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = hoverColor;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = "white";
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontWeight: "bold",
                          fontSize: "1.1em",
                          color: "var(--color-dark-gray)",
                        }}
                      >
                        {gift.name}
                      </div>
                      <div
                        style={{
                          color: "var(--color-pink-deep)",
                          marginTop: "5px",
                          fontWeight: "bold",
                        }}
                      >
                        {formatPrice(gift.price)}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      {gift.status === "available" && (
                        <button
                          onClick={() => {
                            setSelectedGift(gift);
                            setShowReserveModal(true);
                            setErrorMessage(null);
                            setReserveStatus(null);
                            fetchGuests();
                          }}
                          style={btnStylePinkSoft}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "var(--color-pink-deep)";
                            e.currentTarget.style.transform = "scale(1.05)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "var(--color-pink-soft)";
                            e.currentTarget.style.transform = "scale(1)";
                          }}
                        >
                          Reservar
                        </button>
                      )}
                      {gift.status === "reserved" && (
                        <button
                          onClick={() => handleConfirmPurchase(gift)}
                          style={btnStyleGreen}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#218838";
                            e.currentTarget.style.transform = "scale(1.05)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#28a745";
                            e.currentTarget.style.transform = "scale(1)";
                          }}
                        >
                          Confirmar Compra
                        </button>
                      )}
                      {gift.status === "purchased" && (
                        <span
                          style={{
                            padding: "8px 16px",
                            backgroundColor: "#6c757d",
                            color: "white",
                            borderRadius: "20px",
                            fontSize: "0.9em",
                            fontWeight: "bold",
                          }}
                        >
                          Comprado
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* Modal Reserva */}
      {showReserveModal && selectedGift && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => {
            // Fecha modal ao clicar fora do conteúdo
            setShowReserveModal(false);
            setSelectedGift(null);
            setSelectedGuestId("");
            setErrorMessage(null);
            setReserveStatus(null);
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "12px",
              maxWidth: "400px",
              width: "90%",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()} // impede fechar modal ao clicar dentro
          >
            <h3
              style={{
                color: "var(--color-pink-deep)",
                marginBottom: "15px",
                textAlign: "center",
              }}
            >
              Reservar Presente
            </h3>
            <div style={{ marginBottom: "20px", textAlign: "center" }}>
              <strong>{selectedGift.name}</strong>
              <br />
              <span style={{ color: "var(--color-pink-deep)", fontWeight: "bold" }}>
                {formatPrice(selectedGift.price)}
              </span>
            </div>

            {reserveStatus === "loading" && (
              <p style={{ color: "blue", textAlign: "center" }}>
                Processando reserva...
              </p>
            )}
            {errorMessage && (
              <p style={{ color: "red", textAlign: "center" }}>{errorMessage}</p>
            )}

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>
                Selecione o Convidado: <span style={{ color: "red" }}>*</span>
              </label>
              {isLoadingGuests ? (
                <p style={{ color: "var(--color-pink-deep)", textAlign: "center" }}>
                  Carregando convidados...
                </p>
              ) : guests.length === 0 ? (
                <div style={{ textAlign: "center" }}>
                  <p style={{ color: "red", marginBottom: "10px" }}>
                    Nenhum convidado confirmado encontrado.
                  </p>
                  <button
                    onClick={fetchGuests}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "var(--color-pink-soft)",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontSize: "0.9em",
                    }}
                  >
                    Tentar Novamente
                  </button>
                </div>
              ) : (
                <select
                  value={selectedGuestId}
                  onChange={(e) => setSelectedGuestId(Number(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid var(--color-light-gray)",
                    fontSize: "1em",
                    backgroundColor: "white",
                  }}
                >
                  <option value="">Selecione um convidado</option>
                  {guests.map((guest) => (
                    <option key={`guest-${guest.id}`} value={guest.id}>
                      {guest.name} {guest.email ? `(${guest.email})` : ""}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "center",
              }}
            >
              <button
                onClick={() => {
                  setShowReserveModal(false);
                  setSelectedGift(null);
                  setSelectedGuestId("");
                  setErrorMessage(null);
                  setReserveStatus(null);
                }}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleReserveGift}
                disabled={reserveStatus === "loading" || guests.length === 0}
                style={{
                  padding: "10px 20px",
                  backgroundColor:
                    guests.length === 0 ? "#ccc" : "var(--color-pink-soft)",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor:
                    reserveStatus === "loading" || guests.length === 0
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                {reserveStatus === "loading" ? "Reservando..." : "Confirmar Reserva"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Botões estilizados para reutilizar
const btnStylePinkSoft: React.CSSProperties = {
  padding: "8px 16px",
  backgroundColor: "var(--color-pink-soft)",
  color: "white",
  border: "none",
  borderRadius: "20px",
  cursor: "pointer",
  fontSize: "0.9em",
  fontWeight: "bold",
  transition: "all 0.3s ease",
};

const btnStyleGreen: React.CSSProperties = {
  padding: "8px 16px",
  backgroundColor: "#28a745",
  color: "white",
  border: "none",
  borderRadius: "20px",
  cursor: "pointer",
  fontSize: "0.9em",
  fontWeight: "bold",
  transition: "all 0.3s ease",
};
