import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export class ClassValidator {
  static async validate<T extends object, V>(
    cls: ClassConstructor<T>,
    plainObject: V
  ): Promise<T> {
    if (!plainObject) {
      throw { status: 400, message: 'No data provided for validation.' };
    }

    const instance = plainToInstance(cls, plainObject);
    const errors = await validate(instance);

    if (errors.length > 0) {
      const messages: string[] = [];

      for (const error of errors) {
        if (error.constraints) {
          messages.push(...Object.values(error.constraints));
        }
      }

      throw { status: 400, message: messages.join('; ') };
    }
    return instance;
  }
}
