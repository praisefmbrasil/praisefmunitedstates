import crypto from "crypto";

export async function POST(request) {
  const body = await request.json().catch(() => ({}));

  const headers = request.headers;

  const forwarded = headers.get("x-forwarded-for") || "";
  const ip = forwarded.split(",")[0].trim();

  const salt = process.env.AUDIT_SALT || "praise-fm-audit";

  const ipHash = ip
    ? crypto
        .createHash("sha256")
        .update(ip + salt)
        .digest("hex")
        .slice(0, 16)
    : null;

  const log = {
    timestamp: new Date().toISOString(),

    event: body.event || "unknown",
    session_id: body.session_id || null,
    page: body.page || null,

    country: headers.get("x-vercel-ip-country"),
    region: headers.get("x-vercel-ip-country-region"),
    city: headers.get("x-vercel-ip-city"),

    ip_hash: ipHash,

    user_agent: headers.get("user-agent"),
    referer: headers.get("referer"),
  };

  console.log(
    "PRAISE_STREAM_AUDIT",
    JSON.stringify(log)
  );

  return Response.json({
    ok: true,
    timestamp: log.timestamp,
  });
}