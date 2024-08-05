import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class RabbitMQController {
  @EventPattern('job-q')
  async handleMessage(@Payload() data: any) {
    console.log('Received message:', data);
    // Process the message here
  }
}
