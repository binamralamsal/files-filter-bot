export const encodeString = (string: string) => {
  return Buffer.from(string, "utf8").toString("base64url");
};

export const decodeString = (string: string) => {
  return Buffer.from(string, "base64url").toString("utf8");
};
