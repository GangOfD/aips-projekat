import { PredefinedTags } from '../models/tags/enumTags';

const allTags = Object.values(PredefinedTags);

export function generateRandomTags(): PredefinedTags[] {
    let randomTags: PredefinedTags[] = [];

    while (randomTags.length < 5) {
        const randomTag = allTags[Math.floor(Math.random() * allTags.length)];
        if (!randomTags.includes(randomTag)) {
            randomTags.push(randomTag);
        }
    }

    return randomTags;
}
