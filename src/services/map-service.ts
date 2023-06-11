import { EventTypes, Map, UiAnimal } from '../../common';
import { EventBus } from '../event-bus';
import { AnimalService } from './animal-service';
import { ECSService } from './ecs-service';
import { LogService } from './log-service';
import { SocketService } from './socket-service';
export class MapService {
  private static instance?: MapService = undefined;
  public static getInstance(): MapService {
    if (!this.instance) {
      this.instance = new MapService();
    }
    return this.instance;
  }
  constructor() {
    EventBus.getInstance().register(EventTypes.RequestMaps, this.setMaps);
    EventBus.getInstance().register(EventTypes.RequestAnimal, this.addAnimal);
  }
  public requestMaps = () => {
    LogService.getInstance().addLogItem('[MapService] requesting map');
    SocketService.getInstance().requestMaps();
  };
  public requestAnimal = () => {
    LogService.getInstance().addLogItem('[MapService] requesting animal');
    SocketService.getInstance().requestAnimal();
  };
  public setMaps = (maps: Array<Map>) => {
    LogService.getInstance().addLogItem('[MapService] setting maps');
    ECSService.getInstance().setMaps(maps);
  };
  public addAnimal = (animal: UiAnimal) => {
    LogService.getInstance().addLogItem('[MapService] adding animal', animal);
    AnimalService.getInstance().addAnimal(animal);
  };
  public saveMap = (map: Map) => {
    if (map.id) {
      LogService.getInstance().addLogItem('[MapService] updating map', map);
      SocketService.getInstance().updateMap(map);
    } else {
      LogService.getInstance().addLogItem('[MapService] creating map', map);
      SocketService.getInstance().createMap(map);
    }
  };
}
