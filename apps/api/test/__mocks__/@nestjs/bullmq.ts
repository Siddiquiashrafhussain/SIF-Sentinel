import { Module, Inject } from '@nestjs/common';

export const getQueueToken = (name: string) => `BullQueue_${name}`;
export const getFlowProducerToken = (name: string) => `BullFlowProducer_${name}`;

@Module({})
export class BullModule {
  static forRootAsync() { return { module: BullModule, providers: [], exports: [] }; }
  static registerQueue(options: any) { 
    return { 
      module: BullModule, 
      providers: [{ provide: getQueueToken(options.name), useValue: { add: jest.fn() } }],
      exports: [{ provide: getQueueToken(options.name), useValue: { add: jest.fn() } }]
    }; 
  }
}

export const InjectQueue = (name: string) => Inject(getQueueToken(name));
export const Processor = () => () => {};
export const Process = () => () => {};
export const InjectFlowProducer = () => () => {};
export class WorkerHost {
  process() { return Promise.resolve(); }
}
