// Proxy seguro: la API key vive en la variable de entorno GROQ_API_KEY de Netlify
exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Método no permitido" };
  try {
    const { messages } = JSON.parse(event.body || "{}");
    if (!Array.isArray(messages)) return { statusCode: 400, body: JSON.stringify({ error: "Faltan mensajes" }) };
    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + process.env.GROQ_API_KEY },
      body: JSON.stringify({ model: "llama-3.3-70b-versatile", temperature: 0.5, max_tokens: 1500, messages }),
    });
    const d = await r.json();
    if (!r.ok) return { statusCode: r.status, body: JSON.stringify({ error: d.error?.message || "Error de Groq" }) };
    return { statusCode: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: d.choices[0].message.content }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: String(e) }) };
  }
};
