import { Model } from 'mongoose';
import {
  ListStudentsFromClassByIdPort,
  ListStudentsFromClassByIdPortInput,
  ListStudentsFromClassByIdPortResult,
} from '../../../domain/ports/list-students-from-class-by-id.port';
import { StudentDocument } from '../../schemas/student.shema';

export class ListStudentsFromClassByIdMongooseAdapter implements ListStudentsFromClassByIdPort {
  constructor(private readonly StudentModel: Model<StudentDocument>) {}

  async execute({ classId }: ListStudentsFromClassByIdPortInput): Promise<ListStudentsFromClassByIdPortResult> {
    try {
      const students = (await this.StudentModel.find<StudentDocument>({ classCodeList: { $in: [classId] } })
        .lean()
        .exec()) as StudentDocument[];

      
      console.log('studentDocumentList', students);

      
      return this.mapStudentsToModel(students);
    } catch (error) {
      console.error('Erro ao buscar os alunos:', error);
      throw new Error('Falha ao buscar os alunos');
    }
  }

  private mapStudentsToModel(studentDocumentList: StudentDocument[]): ListStudentsFromClassByIdPortResult {
    return studentDocumentList.map(student => ({
      nome: student.name,  
      ra: student.id,      
      situacao: student.status,  
    }));
  }
}