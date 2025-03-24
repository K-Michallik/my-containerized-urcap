import { ApplicationNode } from '@universal-robots/contribution-api';

export interface ContainerApplicationNode extends ApplicationNode {
  type: string;
  version: string;
}
