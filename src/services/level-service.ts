import { EventTypes, Level, UiAnimal } from '../../common';
import { EventBus } from '../event-bus';
import { AnimalService } from './animal-service';
import { ECSService } from './ecs-service';
import { LogService } from './log-service';
import { SocketService } from './socket-service';
export class LevelService {
  private static instance?: LevelService = undefined;
  public static getInstance(): LevelService {
    if (!this.instance) {
      this.instance = new LevelService();
    }
    return this.instance;
  }
  constructor() {
    EventBus.getInstance().register(EventTypes.RequestLevels, this.setLevels);
    EventBus.getInstance().register(EventTypes.RequestAnimal, this.addAnimal);
  }
  public requestLevels = () => {
    LogService.getInstance().addLogItem('[LevelService] requesting level');
    SocketService.getInstance().requestLevels();
  };
  public generateLevel = () => {
    LogService.getInstance().addLogItem('[LevelService] fetching generated level');
    SocketService.getInstance().generateLevel();
  };
  public requestAnimal = () => {
    LogService.getInstance().addLogItem('[LevelService] requesting animal');
    SocketService.getInstance().requestAnimal();
  };
  public setLevels = (levels: Array<Level>) => {
    LogService.getInstance().addLogItem('[LevelService] setting levels');
    ECSService.getInstance().setLevels(levels);
  };
  public addAnimal = (animal: UiAnimal) => {
    LogService.getInstance().addLogItem('[LevelService] adding animal', animal);
    AnimalService.getInstance().addAnimal(animal);
  };
  public saveLevel = (level: Level) => {
    if (level.id) {
      LogService.getInstance().addLogItem('[LevelService] updating level', level);
      SocketService.getInstance().updateLevel(level);
    } else {
      LogService.getInstance().addLogItem('[LevelService] creating level', level);
      SocketService.getInstance().createLevel(level);
    }
  };
}
