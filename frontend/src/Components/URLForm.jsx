import React, { useState } from "react";

const theme = {
  primary: "#ff8008",
  secondary: "#ffc837",
  bgLight: "#fdf9f3",
  cardBg: "#ffffff",
  textPrimary: "#222222",
  borderGray: "#e0e0e0",
  shadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
  borderRadius: "16px",
};

const Container = ({ children }) => (
  <div
    style={{
      fontFamily: "'Inter', sans-serif",
      background: theme.bgLight,
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
    }}
  >
    {children}
  </div>
);

const Header = () => (
  <header
    style={{
      background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})`,
      padding: "1.5rem 2rem",
      color: "white",
      fontSize: "2.25rem",
      fontWeight: "800",
      textAlign: "center",
      letterSpacing: "-0.5px",
      boxShadow: theme.shadow,
    }}
  >
    🔗 Pro URL Shortener
  </header>
);

const Footer = () => (
  <footer
    style={{
      background: theme.primary,
      color: "white",
      textAlign: "center",
      padding: "1.25rem",
      fontSize: "0.95rem",
      fontWeight: "600",
      boxShadow: "0 -2px 10px rgba(255,128,8,0.3)",
    }}
  >
    © 2025 URL Shortener · Shruti Bhilave 😊
  </footer>
);

const CollapsibleCard = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      style={{
        background: theme.cardBg,
        borderRadius: theme.borderRadius,
        boxShadow: theme.shadow,
        overflow: "hidden",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          padding: "1rem 2rem",
          background: open ? theme.secondary : theme.primary,
          color: "white",
          fontSize: "1.25rem",
          fontWeight: "600",
          textAlign: "left",
          border: "none",
          cursor: "pointer",
        }}
      >
        {title}
      </button>
      {open && <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>{children}</div>}
    </div>
  );
};

const URLForm = () => {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [loadingShorten, setLoadingShorten] = useState(false);
  const [expiry, setExpiry] = useState(null);
  const [rateLimit, setRateLimit] = useState(null);
  const [rateLimitReset, setRateLimitReset] = useState(null);
  const [originalUrl, setOriginalUrl] = useState("");
  const [lookupId, setLookupId] = useState("");
  const [lookupResult, setLookupResult] = useState("");

const handleShorten = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    setLoadingShorten(true);

    try {
      const response = await fetch("http://localhost:8000/api/v1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url, customShort: "", expiry: 45 }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to shorten URL");
        setLoadingShorten(false);
        return;
      }

      setShortUrl(data.short);
      setExpiry(data.expiry);
      setRateLimit(data.rate_limit);
      setRateLimitReset(data.rate_limit_reset);
      setOriginalUrl(url);
      setUrl("");
    } catch (error) {
      alert("Error shortening URL: " + error.message);
    } finally {
      setLoadingShorten(false);
    }
  };

  const handleLookup = async () => {
    if (!lookupId.trim()) return;

    try {
      const response = await fetch(`http://localhost:8000/api/v1/${lookupId}`);
      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Short ID not found");
        return;
      }

      setLookupResult(data.data);
    } catch (error) {
      alert("Error retrieving original URL: " + error.message);
    }
  };

  return (
    <Container>
      <Header />

      <main style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '2rem', gap: '2rem' }}>
        <div style={{ flex: 1 }}>
          <CollapsibleCard title="🔗 Shorten URL" defaultOpen>
            <form
              onSubmit={handleShorten}
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <input
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                style={{
                  padding: "0.75rem 1rem",
                  fontSize: "1rem",
                  borderRadius: "8px",
                  border: `1px solid ${theme.borderGray}`,
                  outlineColor: theme.secondary,
                }}
              />
              <button
                type="submit"
                disabled={loadingShorten}
                style={{
                  padding: "0.75rem 1rem",
                  fontSize: "1rem",
                  fontWeight: "600",
                  borderRadius: "8px",
                  border: "none",
                  background: theme.primary,
                  color: "white",
                  cursor: loadingShorten ? "not-allowed" : "pointer",
                }}
              >
                {loadingShorten ? "Shortening..." : "Shorten URL"}
              </button>

              {shortUrl && (
                <div>
                  <p>
                    <strong>Original URL:</strong>{" "}
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      {originalUrl}
                    </a>
                  </p>
                  <p>
                    <strong>Short URL:</strong>{" "}
                    <a href={shortUrl} target="_blank" rel="noopener noreferrer">
                      {shortUrl}
                    </a>
                  </p>
                  <p>
                    <strong>Expiry (hours):</strong> {expiry}
                  </p>
                  <p>
                    <strong>Rate Limit Remaining:</strong> {rateLimit}
                  </p>
                  <p>
                    <strong>Rate Limit Reset (minutes):</strong> {rateLimitReset}
                  </p>
                </div>
              )}
            </form>
          </CollapsibleCard>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <CollapsibleCard title="🔍 Find Original URL">
            <input
              type="text"
              placeholder="Enter short ID"
              value={lookupId}
              onChange={(e) => setLookupId(e.target.value)}
              style={{
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                border: `1px solid ${theme.borderGray}`,
                outlineColor: theme.secondary
              }}
            />
            <button
              onClick={handleLookup}
              style={{
                padding: "0.75rem 1rem",
                background: theme.secondary,
                color: 'white',
                fontWeight: '600',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Get Original URL
            </button>
            {lookupResult && (
              <p>
                <strong>Original URL:</strong>{" "}
                <a href={lookupResult} target="_blank" rel="noopener noreferrer">
                  {lookupResult}
                </a>
              </p>
            )}
          </CollapsibleCard>


          <CollapsibleCard title="✏️ Edit Short URL">
            <input type="text" placeholder="Enter short ID" style={{ padding: "0.75rem 1rem", borderRadius: "8px", border: `1px solid ${theme.borderGray}`, outlineColor: theme.secondary }} />
            <input type="url" placeholder="Enter new URL" style={{ padding: "0.75rem 1rem", borderRadius: "8px", border: `1px solid ${theme.borderGray}`, outlineColor: theme.secondary }} />
            <button style={{ padding: "0.75rem 1rem", background: theme.primary, color: 'white', fontWeight: '600', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>Update URL</button>
          </CollapsibleCard>

          <CollapsibleCard title="🗑️ Delete Short URL">
            <input type="text" placeholder="Enter short ID" style={{ padding: "0.75rem 1rem", borderRadius: "8px", border: `1px solid ${theme.borderGray}`, outlineColor: theme.secondary }} />
            <button style={{ padding: "0.75rem 1rem", background: 'crimson', color: 'white', fontWeight: '600', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>Delete URL</button>
          </CollapsibleCard>
        </div>
      </main>

      <Footer />
    </Container>
  );
};

export default URLForm;
