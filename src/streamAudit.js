export function streamAudit(eventName) {
  let sessionId = localStorage.getItem("praise_audit_id");

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("praise_audit_id", sessionId);
  }

  fetch("/api/stream-audit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      event: eventName,
      session_id: sessionId,
      page: window.location.pathname,
    }),
    keepalive: true,
  }).catch(() => {});
}