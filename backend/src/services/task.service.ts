import { eq, and, asc } from "drizzle-orm";
import type { Database } from "../db";
import { tasks, type Task, type NewTask } from "../db/schema";

export class TaskService {
  constructor(private readonly db: Database) {}

  async findByProjectId(projectId: string): Promise<Task[]> {
    return this.db
      .select()
      .from(tasks)
      .where(eq(tasks.projectId, projectId))
      .orderBy(asc(tasks.position))
      .all();
  }

  async findByWorkspaceId(workspaceId: string): Promise<Task[]> {
    return this.db
      .select()
      .from(tasks)
      .where(eq(tasks.workspaceId, workspaceId))
      .all();
  }

  async findByWorkspaceAndStatus(
    workspaceId: string,
    status: Task["status"],
  ): Promise<Task[]> {
    return this.db
      .select()
      .from(tasks)
      .where(
        and(eq(tasks.workspaceId, workspaceId), eq(tasks.status, status)),
      )
      .orderBy(asc(tasks.position))
      .all();
  }

  async findByAssigneeId(assigneeId: string): Promise<Task[]> {
    return this.db
      .select()
      .from(tasks)
      .where(eq(tasks.assigneeId, assigneeId))
      .all();
  }

  async findById(id: string): Promise<Task | undefined> {
    return this.db.select().from(tasks).where(eq(tasks.id, id)).get();
  }

  async create(data: NewTask): Promise<Task> {
    const [created] = await this.db.insert(tasks).values(data).returning();
    return created;
  }

  async update(
    id: string,
    data: Partial<Omit<NewTask, "id">>,
  ): Promise<Task | undefined> {
    const [updated] = await this.db
      .update(tasks)
      .set(data)
      .where(eq(tasks.id, id))
      .returning();
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(tasks).where(eq(tasks.id, id));
  }
}
