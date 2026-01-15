import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const getDb = (url: string) => {
  const sql = neon(url);
  return drizzle(sql, { schema });
};

export { getDb };
