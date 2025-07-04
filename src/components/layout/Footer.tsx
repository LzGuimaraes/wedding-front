// your-wedding-frontend/src/components/layout/Footer.tsx

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "var(--color-deep-rose)",
        color: "var(--color-white)",
        textAlign: "center",
        marginTop: "50px",
        fontFamily: "inherit",
      }}
    >
      <p> Casamento Vitória & André Luiz. </p>
      <p style={{ fontSize: "0.9em", marginTop: "10px" }}>
        Feito com carinho para o nosso grande dia!
      </p>
    </footer>
  );
}
