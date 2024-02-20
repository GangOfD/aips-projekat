import { ITagSelectionStrategy } from './ITagSelectionStrategy';
import { PredefinedTags } from '../models/tags/enumTags';
import {ENV} from '../enviroments/constants'

export class UserDefinedTagsStrategy implements ITagSelectionStrategy {
  constructor(private tags: PredefinedTags[]) {}

  selectTags(): PredefinedTags[] {
    return this.tags.slice(0, ENV.num_of_tags);
  }
}
