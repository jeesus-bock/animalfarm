import { Animal } from '../../common';
import { ECSService } from './ecs-service';
import { LogService } from './log-service';

export class AnimalService {
  private static instance?: AnimalService = undefined;
  public static getInstance(): AnimalService {
    if (!this.instance) {
      this.instance = new AnimalService();
    }
    return this.instance;
  }
  constructor() {}
  public addAnimal(animal: Animal) {
    LogService.getInstance().addLogItem('[AnimalService] addAnimal', animal);
    ECSService.getInstance().addAnimal(animal);
  }
}
