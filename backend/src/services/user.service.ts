import { eq } from "drizzle-orm";
import type { Database } from "../db";
import { users, type User, type NewUser } from "../db/schema";

export class UserService {
  constructor(private readonly db: Database) {}

  async findAll(): Promise<User[]> {
    return this.db.select().from(users).all();
  }

  async findById(id: string): Promise<User | undefined> {
    return this.db.select().from(users).where(eq(users.id, id)).get();
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.db.select().from(users).where(eq(users.email, email)).get();
  }

  async create(data: NewUser): Promise<User> {
    const [created] = await this.db.insert(users).values(data).returning();
    return created;
  }

  async update(
    id: string,
    data: Partial<Omit<NewUser, "id">>,
  ): Promise<User | undefined> {
    const [updated] = await this.db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(users).where(eq(users.id, id));
  }
}
