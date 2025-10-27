import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Group } from './Group';

@Entity('student')
export class Student {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text', nullable: true })
  first_name!: string;

  @Column({ type: 'text', nullable: true })
  last_name!: string;

  @Column({ type: 'text', nullable: true })
  middle_name!: string;

  @Column({ type: 'integer', nullable: true })
  groupId!: number;

  @ManyToOne(() => Group, { nullable: true })
  @JoinColumn({ name: 'groupId' })
  group?: Group;
}
