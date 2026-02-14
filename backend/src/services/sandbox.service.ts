import { injectable } from 'inversify';

@injectable()
export class SandboxService {
  async validateModule(packageName: string) {
    return { status: 'validated', score: 100 };
  }
}
