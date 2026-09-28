import { drizzle, DrizzleD1Database } from "drizzle-orm/d1";
import { schemaRelations } from "./schema";

export type Database = DrizzleD1Database<typeof schemaRelations>;

export function createDb(d1: D1Database): Database {
  return drizzle(d1, { relations: schemaRelations });
}
