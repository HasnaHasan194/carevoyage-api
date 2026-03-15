import fs from "fs";
import path from "path";
import { RepositoryRegister } from "./repository.register";
import { ServiceRegistery } from "./service.register";
import { UsecaseRegistory } from "./usecase.register";

// #region agent log: DI index loaded (after repository, service, usecase register modules)
try {
  fs.appendFileSync(
    path.join(process.cwd(), "..", ".cursor", "debug.log"),
    JSON.stringify({ hypothesisId: "DI", location: "dependencyinjection/index.ts", message: "DI index module loaded", timestamp: Date.now() }) + "\n"
  );
} catch {
  // ignore
}
// #endregion agent log

export class DependencyInjection {
  static registerAll(): void {
    UsecaseRegistory.registerUsecase();
    RepositoryRegister.registerRepository();
    ServiceRegistery.registerService();
  }
}
