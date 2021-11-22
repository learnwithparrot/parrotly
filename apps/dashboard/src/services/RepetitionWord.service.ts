import { CollectionService } from "./Collection.service";
import type { IRepetitionWord } from "@parrotly.io/types";

export class RepetitionWordService extends CollectionService<IRepetitionWord>{

  formatForFirestore(_: IRepetitionWord): IRepetitionWord {
    return _;
  }

  formatFromFirestore(_: IRepetitionWord): IRepetitionWord {
    return _;
  }

}
