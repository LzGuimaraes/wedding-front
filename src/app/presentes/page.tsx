// ListaPresentes.tsx com limite de altura e scroll nos quadrantes de presentes

"use client";

import { useState, useEffect } from "react";

interface Gift {
  id: number;
  name: string;
  price: number;
  status: "available" | "reserved" | "purchased";
  guest_id?: number;
}

export default function ListaPresentes() {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

  const fetchGifts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/gifts`);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data: Gift[] = await response.json();
      setGifts(data);
    } catch (error: unknown) {
      console.error("Erro ao buscar presentes:", error);
    }
  };

  useEffect(() => {
    fetchGifts();
  }, []);

  const filterGiftsBySearch = (gifts: Gift[]) =>
    !searchTerm.trim()
      ? gifts
      : gifts.filter((gift) =>
          gift.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
        );

  const getGiftsByStatus = (status: Gift["status"]) =>
    filterGiftsBySearch(gifts.filter((gift) => gift.status === status));

  const availableGifts = getGiftsByStatus("available");
  const reservedGifts = getGiftsByStatus("reserved");
  const purchasedGifts = getGiftsByStatus("purchased");

  const formatPrice = (price?: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price ?? 0);

  return (
    <div style={{
      maxWidth: "900px",
      margin: "50px auto",
      padding: "30px",
      borderRadius: "20px",
      background: "linear-gradient(135deg, #fff0f5, #fbe7ef)",
      boxShadow: "0 8px 24px rgba(255, 192, 203, 0.4)",
      fontFamily: "'Times New Roman', serif"
    }}>
      <h1 style={{
        textAlign: "center",
        color: "var(--color-deep-rose)",
        fontSize: "2.4em",
        marginBottom: "10px"
      }}>🎁 Lista de Presentes</h1>

      <p style={{ textAlign: "center", marginBottom: "30px", fontSize: "1.1em" }}>
        Escolha um presente para reservar ou confirme a compra dos presentes já reservados.
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
          transition: "all 0.3s ease"
        }}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
        {[{
          title: "Disponíveis",
          icon: "🎁",
          data: availableGifts,
          color: "#fff5fa"
        }, {
          title: "Reservados",
          icon: "⏳",
          data: reservedGifts,
          color: "#fff9f0"
        }, {
          title: "Comprados",
          icon: "✅",
          data: purchasedGifts,
          color: "#f0fff7"
        }].map(({ title, icon, data, color }) => (
          <div key={title} style={{
            backgroundColor: color,
            borderRadius: "15px",
            padding: "20px",
            maxHeight: "400px",
            overflowY: "auto"
          }}>
            <h2 style={{ color: "var(--color-pink-deep)", fontSize: "1.4em", marginBottom: "10px" }}>{icon} {title}</h2>
            {data.length === 0 ? (
              <p style={{ color: "#aaa", textAlign: "center" }}>Nenhum presente nesta categoria.</p>
            ) : (
              <ul style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "grid",
                gap: "20px",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))"
              }}>
                {data.map(gift => (
                  <li key={gift.id} style={{
                    background: "white",
                    borderRadius: "10px",
                    padding: "15px 20px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <div>
                      <div style={{ fontWeight: "bold", fontSize: "1.1em" }}>{gift.name}</div>
                      <div style={{ color: "var(--color-pink-deep)", marginTop: "4px" }}>{formatPrice(gift.price)}</div>
                    </div>
                    <div>
                      {gift.status === "available" && <button style={btnStyle}>Reservar</button>}
                      {gift.status === "reserved" && <button style={{ ...btnStyle, backgroundColor: "#28a745" }}>Confirmar Compra</button>}
                      {gift.status === "purchased" && <span style={{ color: "gray", fontStyle: "italic" }}>Comprado</span>}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  padding: "8px 16px",
  background: "linear-gradient(135deg, #f8c8dc, #e5a3c7)",
  border: "none",
  borderRadius: "20px",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "all 0.3s ease"
};
