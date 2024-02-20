import { PredefinedTags } from "../models/tags/enumTags";

export interface ITagSelectionStrategy {
    selectTags(): PredefinedTags[];
  }
  