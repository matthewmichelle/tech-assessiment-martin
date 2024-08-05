import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'timestamp', nullable: true })
  lastRun: Date;

  @Column({ type: 'timestamp', nullable: true })
  nextRun: Date;

  @Column({ nullable: true })
  interval: string;

  @Column({ default: true, nullable: true })
  isActive: boolean;

  @Column({ nullable: false })
  details: string;
}
