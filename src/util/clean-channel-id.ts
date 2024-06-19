export function cleanChannelID(channelId: string) {
  return channelId.replace(/[^\d-]/g, "");
}
