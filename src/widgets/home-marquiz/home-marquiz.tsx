import { getHomeMarquizData } from "@/shared/lib/payload/home-marquiz";

import { HomeMarquizClient } from "./home-marquiz-client";

export async function HomeMarquiz() {
  const data = await getHomeMarquizData();

  return <HomeMarquizClient data={data} />;
}
