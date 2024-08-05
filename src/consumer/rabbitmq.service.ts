import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class RabbitMQService {
  constructor(@InjectQueue('main_queue') private readonly mainQueue: Queue) {}

  async sendMessage(message: string) {
    await this.mainQueue.add('message-job', { text: message });
  }
}
