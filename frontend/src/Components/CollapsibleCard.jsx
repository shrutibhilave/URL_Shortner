import React, { useState } from "react";
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

export default CollapsibleCard;