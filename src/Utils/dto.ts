import { ClassConstructor, plainToInstance } from 'class-transformer';

export const fillDTO = <T, V>(someDto: ClassConstructor<T>, plainObject: V) =>
  plainToInstance(someDto, plainObject, {
    excludeExtraneousValues: true,
    enableImplicitConversion: true
  });
