import { InlineKeyboard } from "grammy";

import crypto from "crypto";

import { env } from "#/config/env";
import { searchClient } from "#/lib/meilisearch";
import { encodeString } from "#/util/base64-url";
import { formatFileSize } from "#/util/format-file-size";
import { toFancyText } from "#/util/to-fancy-text";

import type { FileResult } from "./insert-files";

export async function getSearchResults(
  query: string,
  page: number,
  hitsPerPage = env.RESULTS_PER_PAGE,
) {
  return await searchClient
    .index(env.MEILISEARCH_INDEX)
    .search<FileResult>(query, {
      rankingScoreThreshold: 0.3,
      hitsPerPage,
      page,
      attributesToSearchOn: ["text"],
    });
}

function createInlineKeyboard(page: number, query: string, totalPages: number) {
  const inlineKeyboard = new InlineKeyboard();

  if (page > 1) {
    inlineKeyboard.text("⬅️ Back", `back ${encodeString({ page, query })}`);
  }

  if (totalPages > page) {
    inlineKeyboard.text("Next ➡️", `next ${encodeString({ page, query })}`);
  }

  inlineKeyboard.row();

  inlineKeyboard.text(
    `📃 Pages ${page}/${totalPages}`,
    `pages ${encodeString({ page, query })}`,
  );

  return inlineKeyboard;
}

function formatCaption(text: string, maxLength: number = 180): string {
  return (
    text
      .replace(/[\r\n]+/g, " ")
      .replace(/\s+/g, " ")
      .replace(
        /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF]|[\u2600-\u26FF]|[\u3000-\u303F])/gu,
        "",
      )
      .replace(
        /\.(mp4|mov|avi|mkv|flv|wmv|mpg|mpeg|3gp|webm|vob|ogv|m4v|f4v|rm|rmvb|ts|m2ts|asf|swf|divx|xvid|h264|h265|vp8|vp9|av1)$/gi,
        "",
      )
      .replace(/\./g, " ")
      .slice(0, maxLength) + (text.length > maxLength ? "..." : "")
  );
}

function generateFileLink(
  username: string,
  queryHash: string,
  file: FileResult,
): string {
  return `https://t.me/${username}?start=send-${encodeString({
    q: queryHash.slice(0, 5),
    m: file.messageId,
    c: file.channelId,
  })}`;
}

export async function getSearchResultsMessageText(data: {
  query: string;
  page?: number;
  username: string;
}) {
  const page = data.page || 1;
  const results = await getSearchResults(data.query, page);

  if (results.hits.length === 0) return { results: null };

  const queryHash = crypto
    .createHash("sha256")
    .update(data.query)
    .digest("base64url");

  const inlineKeyboard = createInlineKeyboard(
    page,
    data.query,
    // @ts-expect-error Meilisearch types fault
    results.totalPages,
  );

  inlineKeyboard.url(
    `Send All Files (${env.SENDALL_PER_PAGE ? results.hits.length : results.estimatedTotalHits})`,
    // @ts-expect-error Meilisearch types fault
    `https://t.me/${data.username}?start=sendall-${results.page}-${encodeString(data.query)}`,
  );

  const formattedResults = results.hits
    .map((file) => {
      const caption = formatCaption(file.text);
      const link = generateFileLink(data.username, queryHash, file);
      return `[${toFancyText(formatFileSize(file.fileSize))}] — <a href="${link}">${toFancyText(caption)}</a>`;
    })
    .join("\n\n");

  return {
    results: formattedResults,
    inlineKeyboard,
  };
}
