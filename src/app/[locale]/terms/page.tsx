export default async function TermsPage() {
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
      <h1 style={headingStyle}>Terms of Service</h1>
      <p style={bodyStyle}>
        GTimer is an unofficial fan project. We are not affiliated with,
        endorsed by, or connected to Rockstar Games or Take-Two Interactive.
      </p>
      <p style={bodyStyle}>
        All trademarks, copyrights, and intellectual property belong to their
        respective owners.
      </p>
      <p style={bodyStyle}>
        The countdown is provided as-is. While we strive for accuracy, we cannot
        guarantee it.
      </p>
    </div>
  );
}
