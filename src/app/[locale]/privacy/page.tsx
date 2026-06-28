export default async function PrivacyPage() {
  const headingStyle = {
    fontFamily: "var(--font-display)",
    fontSize: "clamp(36px, 5vw, 56px)",
    fontWeight: 800,
    letterSpacing: "0.03em",
    textTransform: "uppercase" as const,
    lineHeight: 1,
    color: "#FFD700",
    marginBottom: "8px",
  };

  const subheadingStyle = {
    fontFamily: "var(--font-display)",
    fontSize: "clamp(22px, 3vw, 28px)",
    fontWeight: 800,
    letterSpacing: "0.05em",
    textTransform: "uppercase" as const,
    color: "#C084F0",
    marginTop: "16px",
  };

  const bodyStyle = {
    fontFamily: "var(--font-body)",
    fontSize: "16px",
    fontWeight: 300,
    lineHeight: 1.75,
    color: "#9999BB",
  };

  return (
    <div
      style={{
        maxWidth: "640px",
        margin: "0 auto",
        padding: "96px 24px 64px",
        display: "flex",
        flexDirection: "column" as const,
        gap: "20px",
      }}
    >
      <h1 style={headingStyle}>Privacy Policy</h1>
      <p style={bodyStyle}>
        GTimer is a fan project and does not collect any personal data.
      </p>
      <p style={bodyStyle}>
        All settings are stored locally in your browser using localStorage. No
        information is sent to any server.
      </p>
      <p style={bodyStyle}>
        We use privacy-friendly analytics (Cloudflare Web Analytics) that do not
        use cookies or collect personal information.
      </p>
      <h2 style={subheadingStyle}>Contact</h2>
      <p style={bodyStyle}>
        If you have any questions, please open an issue on our GitHub repository.
      </p>
    </div>
  );
}
