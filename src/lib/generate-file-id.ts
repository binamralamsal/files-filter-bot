export function generateFileId(channelId: string, messageId: number) {
  return `${channelId}_${messageId}`;
}
