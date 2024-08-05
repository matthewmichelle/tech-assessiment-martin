import { Queue } from 'bull';
export declare class RabbitMQService {
    private readonly mainQueue;
    constructor(mainQueue: Queue);
    sendMessage(message: string): Promise<void>;
}
