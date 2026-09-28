import { eq, and } from "drizzle-orm";
import type { Database } from "../db";
import { members, type Member, type NewMember } from "../db/schema";

export class MemberService {
  constructor(private readonly db: Database) {}

  async findByWorkspaceId(workspaceId: string): Promise<Member[]> {
    return this.db
      .select()
      .from(members)
      .where(eq(members.workspaceId, workspaceId))
      .all();
  }

  async findByUserId(userId: string): Promise<Member[]> {
    return this.db
      .select()
      .from(members)
      .where(eq(members.userId, userId))
      .all();
  }

  async findByWorkspaceAndUser(
    workspaceId: string,
    userId: string,
  ): Promise<Member | undefined> {
    return this.db
      .select()
      .from(members)
      .where(
        and(
          eq(members.workspaceId, workspaceId),
          eq(members.userId, userId),
        ),
      )
      .get();
  }

  async create(data: NewMember): Promise<Member> {
    const [created] = await this.db.insert(members).values(data).returning();
    return created;
  }

  async updateRole(
    id: string,
    role: "ADMIN" | "MEMBER",
  ): Promise<Member | undefined> {
    const [updated] = await this.db
      .update(members)
      .set({ role })
      .where(eq(members.id, id))
      .returning();
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(members).where(eq(members.id, id));
  }
}
