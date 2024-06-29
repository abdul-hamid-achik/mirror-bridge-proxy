import type { Policy } from './policy';
import { transformHeaders } from '../utils/headers';

export class HeaderTransformPolicy implements Policy {
  name = 'HeaderTransform';

  async execute(request: any, config: any): Promise<void> {
    await transformHeaders(request.headers, config);
  }
}
