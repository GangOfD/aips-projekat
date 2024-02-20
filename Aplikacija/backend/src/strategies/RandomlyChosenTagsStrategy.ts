import { ITagSelectionStrategy } from './ITagSelectionStrategy';
import { PredefinedTags } from '../models/tags/enumTags';
import { ENV } from '../enviroments/constants'; 

export class RandomlyChosenTagsStrategy implements ITagSelectionStrategy {
  private allTags: PredefinedTags[] = Object.values(PredefinedTags);

  selectTags(): PredefinedTags[] {
    const shuffled = this.allTags.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, ENV.num_of_tags);
  }
}
