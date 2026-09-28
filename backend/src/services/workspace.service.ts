import { eq } from "drizzle-orm";
import type { Database } from "../db";
import {
  workspaces,
  type Workspace,
  type NewWorkspace,
} from "../db/schema";

export class WorkspaceService {
  constructor(private readonly db: Database) {}

  async findAll(): Promise<Workspace[]> {
    return this.db.select().from(workspaces).all();
  }

  async findById(id: string): Promise<Workspace | undefined> {
    return this.db
      .select()
      .from(workspaces)
      .where(eq(workspaces.id, id))
      .get();
  }

  async findByUserId(userId: string): Promise<Workspace[]> {
    return this.db
      .select()
      .from(workspaces)
      .where(eq(workspaces.userId, userId))
      .all();
  }

  async findByInviteCode(code: string): Promise<Workspace | undefined> {
    return this.db
      .select()
      .from(workspaces)
      .where(eq(workspaces.inviteCode, code))
      .get();
  }

  async create(data: NewWorkspace): Promise<Workspace> {
    const [created] = await this.db
      .insert(workspaces)
      .values(data)
      .returning();
    return created;
  }

  async update(
    id: string,
    data: Partial<Omit<NewWorkspace, "id">>,
  ): Promise<Workspace | undefined> {
    const [updated] = await this.db
      .update(workspaces)
      .set(data)
      .where(eq(workspaces.id, id))
      .returning();
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(workspaces).where(eq(workspaces.id, id));
  }
}
