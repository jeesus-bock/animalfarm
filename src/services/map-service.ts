import { Animal, EventTypes, Map } from '../../common';
import { EventBus } from '../event-bus';
import { LogService } from './log-service';
import { SocketService } from './socket-service';
import { addMap, addAnimal } from '../ecs';

export class MapService {
  private static instance?: MapService = undefined;
  public static getInstance(): MapService {
    if (!this.instance) {
      this.instance = new MapService();
    }
    return this.instance;
  }
  constructor() {
    EventBus.getInstance().register(EventTypes.RequestMap, this.addMap);
    EventBus.getInstance().register(EventTypes.RequestAnimal, this.addAnimal);
  }
  public requestMap = () => {
    LogService.getInstance().addLogItem('[MapService] requesting map');
    SocketService.getInstance().requestMap();
  };
  public requestAnimal = () => {
    LogService.getInstance().addLogItem('[MapService] requesting animal');
    SocketService.getInstance().requestAnimal();
  };
  public addMap = (map: Map) => {
    LogService.getInstance().addLogItem('[MapService] adding map');
    addMap(map);
  };
  public addAnimal = (animal: Animal) => {
    LogService.getInstance().addLogItem('[MapService] adding animal', animal);
    addAnimal(animal);
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
