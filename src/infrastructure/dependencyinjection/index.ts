import { RepositoryRegister } from "./repository.register";
import { ServiceRegistery } from "./service.register";
import { UsecaseRegistory } from "./usecase.register";

export class DependencyInjection {
  static registerAll(): void {
    UsecaseRegistory.registerUsecase();
    RepositoryRegister.registerRepository();
    ServiceRegistery.registerService();
  }
}
