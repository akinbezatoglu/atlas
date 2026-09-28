import type { Database } from "./db";
import type { Services } from "./services";

export type AppBindings = {
  Bindings: CloudflareBindings;
  Variables: {
    services: Services;
    userId: string;
    userEmail: string;
    userName: string;
  };
};
