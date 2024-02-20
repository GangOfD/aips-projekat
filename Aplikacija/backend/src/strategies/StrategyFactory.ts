import { ITagSelectionStrategy } from '../strategies/ITagSelectionStrategy';
import { UserDefinedTagsStrategy } from '../strategies/UserDefinedTagsStrategy';
import { RandomlyChosenTagsStrategy } from '../strategies/RandomlyChosenTagsStrategy';
import { PredefinedTags } from '../models/tags/enumTags';

export class TagSelectionStrategyFactory {
  static createStrategy(userTags: PredefinedTags[] | null): ITagSelectionStrategy {
    if (userTags && userTags.length > 0) {
      return new UserDefinedTagsStrategy(userTags);
    } else {
      return new RandomlyChosenTagsStrategy();
    }
  }
}
