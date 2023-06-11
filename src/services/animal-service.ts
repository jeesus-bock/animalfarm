import { Animal, GenUiAnimal, UiAnimal } from '../../common';
import { ECSService } from './ecs-service';
import { getSelectedMap } from './ecs-service/helpers';
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
  public addAnimal(animal: UiAnimal) {
    LogService.getInstance().addLogItem('[AnimalService] addAnimal', animal);
    ECSService.getInstance().addAnimal(animal);
  }
  public GenerateAnimal() {
    const selectedMap = getSelectedMap();
    if (!selectedMap) return;
    const { dimensions, id } = selectedMap;
    const obj = GenUiAnimal(dimensions.x, dimensions.y, id);
    this.addAnimal(obj);
  }
}
