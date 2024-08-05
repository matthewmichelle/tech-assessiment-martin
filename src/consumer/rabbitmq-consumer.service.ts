import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';
import { JobsService } from 'src/jobs/jobs.service';

/**
 * RabbitMQ consumer service for processing messages from a queue.
 *
 * This service connects to RabbitMQ, listens for messages in a specified queue,
 * and processes them by creating jobs using the JobsService.
 *
 * @implements {OnModuleInit}
 * @implements {OnModuleDestroy}
 */
@Injectable()
export class RabbitmqConsumerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitmqConsumerService.name);
  private readonly amqpUrl: string;
  private readonly queue: string;
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  constructor(
    private readonly configService: ConfigService,
    private readonly jobsService: JobsService,
  ) {
    this.amqpUrl = this.configService.get<string>('RABBITMQ_URL');
    this.queue = this.configService.get<string>('RABBITMQ_QUEUE');

    if (!this.amqpUrl || !this.queue) {
      throw new Error('RabbitMQ URL and queue must be provided');
    }
  }

  /**
   * Initializes the RabbitMQ connection and starts consuming messages.
   */
  async onModuleInit() {
    await this.connect();
  }

  /**
   * Closes the RabbitMQ connection when the module is destroyed.
   */
  async onModuleDestroy() {
    await this.disconnect();
  }

  /**
   * Connects to RabbitMQ and starts consuming messages from the queue.
   *
   * @param {number} [retries=5] - Number of connection attempts before giving up.
   * @param {number} [delay=5000] - Delay in milliseconds between connection attempts.
   * @returns {Promise<void>}
   */
  private async connect(retries = 5, delay = 5000): Promise<void> {
    while (retries) {
      try {
        this.connection = await amqp.connect(this.amqpUrl);
        this.channel = await this.connection.createChannel();
        await this.channel.assertQueue(this.queue, { durable: true });

        this.logger.log(
          `Waiting for messages in ${this.queue}. To exit press CTRL+C`,
        );

        this.channel.consume(this.queue, async (msg) => {
          if (msg !== null) {
            try {
              const createJobDto = JSON.parse(msg.content.toString());
              const saved = await this.jobsService.create(createJobDto);
              this.logger.log(
                `Received: ${JSON.stringify(createJobDto)} ${saved}`,
              );
              this.channel.ack(msg);
            } catch (err) {
              this.logger.error('Error processing message', err);
              this.channel.nack(msg, false, false); // Consider whether to requeue the message or not
            }
          }
        });

        break;
      } catch (err) {
        this.logger.error('Error connecting to RabbitMQ', err);
        retries -= 1;
        if (retries) {
          this.logger.log(`Retrying connection in ${delay / 1000} seconds...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        } else {
          this.logger.error(
            'Could not establish RabbitMQ connection. Exiting...',
          );
          throw err;
        }
      }
    }
  }

  /**
   * Closes the RabbitMQ connection and channel.
   *
   * @returns {Promise<void>}
   */
  private async disconnect() {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
    } catch (err) {
      this.logger.error('Error disconnecting from RabbitMQ', err);
    }
  }
}
