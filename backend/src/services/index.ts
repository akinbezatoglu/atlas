import type { Database } from "../db";
import { UserService } from "./user.service";
import { WorkspaceService } from "./workspace.service";
import { MemberService } from "./member.service";
import { ProjectService } from "./project.service";
import { TaskService } from "./task.service";

/**
 * Tüm service'leri birleştiren DI container.
 * Her request'te bir kez oluşturulur ve context'e enjekte edilir.
 */
export class Services {
  readonly users: UserService;
  readonly workspaces: WorkspaceService;
  readonly members: MemberService;
  readonly projects: ProjectService;
  readonly tasks: TaskService;

  constructor(db: Database) {
    this.users = new UserService(db);
    this.workspaces = new WorkspaceService(db);
    this.members = new MemberService(db);
    this.projects = new ProjectService(db);
    this.tasks = new TaskService(db);
  }
}

export { UserService } from "./user.service";
export { WorkspaceService } from "./workspace.service";
export { MemberService } from "./member.service";
export { ProjectService } from "./project.service";
export { TaskService } from "./task.service";
