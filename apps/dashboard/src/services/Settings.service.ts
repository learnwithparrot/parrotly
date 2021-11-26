import { CollectionService } from "./Collection.service";
import type { IUserSettings } from "@parrotly.io/types";

export class SettingsService extends CollectionService<IUserSettings>{

  constructor(){
    super('settings')
  }
}
