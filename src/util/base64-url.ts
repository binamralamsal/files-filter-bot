export function encodeString(text: Record<string, unknown> | string) {
  if (typeof text === "string")
    return Buffer.from(text, "utf8").toString("base64url");
  return Buffer.from(JSON.stringify(text), "utf8").toString("base64url");
}

export function decodeString<T>(text: string, parse = true) {
  if (parse)
    return JSON.parse(Buffer.from(text, "base64url").toString("utf8")) as T;
  return Buffer.from(text, "base64url").toString("utf8") as T;
}
