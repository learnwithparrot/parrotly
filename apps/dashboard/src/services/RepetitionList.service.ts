import { CollectionService } from "./Collection.service";
import type { IRepetitionList } from "@parrotly.io/types";
import { query, where } from "firebase/firestore";

export class RepetitionListService extends CollectionService<IRepetitionList>{

  constructor() {
    super('repetition_lists')
  }

  queryMyRepetitionLists(userId: string) {
    return this.valueChanges(_ => query(_, where('creatorId', '==', userId)))
  }
}
