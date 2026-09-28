import { eq } from "drizzle-orm";
import type { Database } from "../db";
import { projects, type Project, type NewProject } from "../db/schema";

export class ProjectService {
  constructor(private readonly db: Database) {}

  async findByWorkspaceId(workspaceId: string): Promise<Project[]> {
    return this.db
      .select()
      .from(projects)
      .where(eq(projects.workspaceId, workspaceId))
      .all();
  }

  async findById(id: string): Promise<Project | undefined> {
    return this.db
      .select()
      .from(projects)
      .where(eq(projects.id, id))
      .get();
  }

  async create(data: NewProject): Promise<Project> {
    const [created] = await this.db.insert(projects).values(data).returning();
    return created;
  }

  async update(
    id: string,
    data: Partial<Omit<NewProject, "id">>,
  ): Promise<Project | undefined> {
    const [updated] = await this.db
      .update(projects)
      .set(data)
      .where(eq(projects.id, id))
      .returning();
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(projects).where(eq(projects.id, id));
  }
}
