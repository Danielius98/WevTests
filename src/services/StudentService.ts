import { Repository } from 'typeorm';
import { Student } from '../entities/Student';
import { Group } from '../entities/Group';
import { AppDataSource } from '../config/database';

export class StudentService {
  private studentRepository: Repository<Student>;

  constructor() {
    this.studentRepository = AppDataSource.getRepository(Student);
  }

  async getAllStudents(): Promise<Student[]> {
    return await this.studentRepository.find({
      relations: ['group']
    });
  }

  async getStudentById(id: number): Promise<Student | null> {
    return await this.studentRepository.findOne({
      where: { id },
      relations: ['group']
    });
  }

  async createStudent(studentData: Omit<Student, 'id'>): Promise<Student> {
    const student = this.studentRepository.create(studentData);
    const savedStudent = await this.studentRepository.save(student);
    const studentWithGroup = await this.studentRepository.findOne({
      where: { id: savedStudent.id },
      relations: ['group']
    });
    return studentWithGroup || savedStudent;
  }

  async updateStudent(id: number, studentData: Partial<Student>): Promise<Student | null> {
    await this.studentRepository.update(id, studentData);
    return await this.getStudentById(id);
  }

  async deleteStudent(id: number): Promise<boolean> {
    const result = await this.studentRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}

export class GroupService {
  private groupRepository: Repository<Group>;

  constructor() {
    this.groupRepository = AppDataSource.getRepository(Group);
  }

  async getAllGroups(): Promise<Group[]> {
    return await this.groupRepository.find({
      relations: ['students']
    });
  }

  async getGroupById(id: number): Promise<Group | null> {
    return await this.groupRepository.findOne({
      where: { id },
      relations: ['students']
    });
  }

  async createGroup(groupData: Omit<Group, 'id'>): Promise<Group> {
    const group = this.groupRepository.create(groupData);
    return await this.groupRepository.save(group);
  }

  async updateGroup(id: number, groupData: Partial<Group>): Promise<Group | null> {
    await this.groupRepository.update(id, groupData);
    return await this.getGroupById(id);
  }

  async deleteGroup(id: number): Promise<boolean> {
    const result = await this.groupRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
