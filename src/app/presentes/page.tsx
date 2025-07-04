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

  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const renderGiftList = (
    gifts: Gift[],
    title: string,
    icon: string,
    emptyMessage: string,
    bgColor: string,
    hoverColor: string
  ) => (
    <div>
      <h3
        style={{
          color: "var(--color-deep-rose)",
          marginBottom: "10px",
          fontSize: "1.2em",
        }}
      >
        {icon} {title} ({gifts.length})
      </h3>
      <div
        style={{
          maxHeight: "250px",
          overflowY: "auto",
          border: "1px solid var(--color-light-gray)",
          borderRadius: "8px",
          backgroundColor: "#f9f9f9",
          padding: "10px",
        }}
      >
        {gifts.length === 0 ? (
          <p
            style={{
              textAlign: "center",
              color: "var(--color-light-gray)",
              margin: "20px 0",
            }}
          >
            {searchTerm
              ? `Nenhum presente encontrado em "${title}".`
              : emptyMessage}
          </p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {gifts.map((gift, index) => (
              <li
                key={gift.id}
                style={{
                  padding: "15px",
                  borderBottom:
                    index < gifts.length - 1
                      ? "1px dashed var(--color-light-gray)"
                      : "none",
                  backgroundColor: "white",
                  margin: "2px 0",
                  borderRadius: "4px",
                  transition: "background-color 0.2s ease",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = hoverColor;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "white";
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "1.1em",
                      fontWeight: "bold",
                      color: "var(--color-dark-gray)",
                    }}
                  >
                    {gift.name}
                  </div>
                  <div
                    style={{
                      fontSize: "1em",
                      color: "var(--color-deep-rose)",
                      fontWeight: "bold",
                      marginTop: "5px",
                    }}
                  >
                    {formatPrice(gift.price)}
                  </div>
                </div>
                <div
                  style={{ display: "flex", gap: "10px", alignItems: "center" }}
                >
                  {gift.status === "available" && (
                    <button
                      onClick={() => {
                        setSelectedGift(gift);
                        setShowReserveModal(true);
                        setErrorMessage(null);
                        setReserveStatus(null);
                        fetchGuests(); // Buscar convidados ao abrir o modal
                      }}
                      style={{
                        padding: "8px 16px",
                        backgroundColor: "var(--color-pink-soft)",
                        color: "white",
                        border: "none",
                        borderRadius: "20px",
                        cursor: "pointer",
                        fontSize: "0.9em",
                        fontWeight: "bold",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "var(--color-deep-rose)";
                        e.currentTarget.style.transform = "scale(1.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "var(--color-pink-soft)";
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      Reservar
                    </button>
                  )}
                  {gift.status === "reserved" && (
                    <button
                      onClick={() => handleConfirmPurchase(gift)}
                      style={{
                        padding: "8px 16px",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "20px",
                        cursor: "pointer",
                        fontSize: "0.9em",
                        fontWeight: "bold",
                        transition: "all 0.3s ease",
                      }}
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
    </div>
  );

  return (
    <div
      style={{
        maxWidth: "800px",
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
        Lista de Presentes
      </h1>
      <p style={{ textAlign: "center", marginBottom: "30px" }}>
        Escolha um presente para reservar ou confirme a compra dos presentes já
        reservados.
      </p>

      {/* Barra de Pesquisa */}
      <div style={{ marginBottom: "30px" }}>
        <input
          type="text"
          placeholder="🔍 Pesquisar presentes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 15px",
            borderRadius: "25px",
            border: "1px solid var(--color-light-gray)",
            fontSize: "1em",
            outline: "none",
            transition: "border-color 0.3s ease",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "var(--color-pink-soft)";
            e.target.style.boxShadow = "0 0 0 3px rgba(255, 192, 203, 0.2)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "var(--color-light-gray)";
            e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";
          }}
        />
      </div>

      {/* Debug Info - Remover em produção */}
      {process.env.NODE_ENV === "development" && (
        <div
          style={{
            marginBottom: "20px",
            padding: "10px",
            backgroundColor: "#f0f0f0",
            borderRadius: "5px",
            fontSize: "0.9em",
          }}
        >
          <strong>Debug Info:</strong> Total de convidados carregados:{" "}
          {guests.length}
          {guests.length > 0 && (
            <div>Primeiro convidado: {JSON.stringify(guests[0])}</div>
          )}
        </div>
      )}

      {isLoadingGifts ? (
        <p style={{ textAlign: "center" }}>Carregando presentes...</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          {renderGiftList(
            availableGifts,
            "Disponíveis",
            "🎁",
            "Nenhum presente disponível no momento.",
            "#f0f8ff",
            "#e6f3ff"
          )}

          {renderGiftList(
            reservedGifts,
            "Reservados",
            "⏳",
            "Nenhum presente reservado.",
            "#fff8f0",
            "#ffebcc"
          )}

          {renderGiftList(
            purchasedGifts,
            "Comprados",
            "✅",
            "Nenhum presente comprado ainda.",
            "#f0fff0",
            "#e6ffe6"
          )}
        </div>
      )}

      {/* Modal de Reserva */}
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
          >
            <h3
              style={{
                color: "var(--color-deep-rose)",
                marginBottom: "15px",
                textAlign: "center",
              }}
            >
              Reservar Presente
            </h3>
            <div style={{ marginBottom: "20px", textAlign: "center" }}>
              <strong>{selectedGift.name}</strong>
              <br />
              <span
                style={{ color: "var(--color-deep-rose)", fontWeight: "bold" }}
              >
                {formatPrice(selectedGift.price)}
              </span>
            </div>

            {reserveStatus === "loading" && (
              <p style={{ color: "blue", textAlign: "center" }}>
                Processando reserva...
              </p>
            )}
            {errorMessage && (
              <p style={{ color: "red", textAlign: "center" }}>
                {errorMessage}
              </p>
            )}

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>
                Selecione o Convidado: <span style={{ color: "red" }}>*</span>
              </label>
              {isLoadingGuests ? (
                <p
                  style={{
                    color: "var(--color-deep-rose)",
                    textAlign: "center",
                  }}
                >
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
              style={{ display: "flex", gap: "10px", justifyContent: "center" }}
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
                {reserveStatus === "loading"
                  ? "Reservando..."
                  : "Confirmar Reserva"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
