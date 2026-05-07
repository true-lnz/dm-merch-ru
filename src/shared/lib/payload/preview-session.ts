import "server-only";

import config from "@payload-config";
import { getPayload } from "payload";

export async function requirePreviewUser(headers: Headers) {
  const payload = await getPayload({
    config,
  });
  const { user } = await payload.auth({
    headers,
  });

  return user;
}
