import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Student } from './Student';

@Entity('class')
export class Group {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text' })
  name!: string;

  @OneToMany(() => Student, student => student.group)
  students?: Student[];
}
