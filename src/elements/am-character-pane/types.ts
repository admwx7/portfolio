type URL = string;

type CharacterClassInput = { definition: { name: string; }; level: number; };
/**
 * Represents a character's levels into a class.
 */
export class CharacterClass {
  name: string;
  level: number;

  constructor({ definition: { name }, level }: CharacterClassInput) {
    this.name = name;
    this.level = level;
  }
}
type CharacterInput = number | string | URL | CharacterClassInput[];
/**
 * Defines a DNDBeyond character reference
 */
export class Character {
  private baseHitPoints = 0;
  private bonusHitPoints?: number;
  private overrideHitPoints?: number;
  private removedHitPoints?: number;

  avatarUrl: URL;
  classes: CharacterClass[];
  id: number;
  name: string;
  readonlyUrl: URL;
  temporaryHitPoints?: number;

  get currentHitPoints(): number {
    const { maxHitPoints, removedHitPoints } = this;

    return maxHitPoints - (removedHitPoints || 0);
  }
  get maxHitPoints(): number {
    const { overrideHitPoints, baseHitPoints, bonusHitPoints } = this;

    return (overrideHitPoints || (baseHitPoints + (bonusHitPoints || 0)));
  }

  constructor(props: Partial<Character> | Record<keyof Character, CharacterInput>) {
    Object.entries(props).
      forEach(([key, value]: [keyof Character, CharacterInput]) => {
        switch (key) {
          case 'currentHitPoints':
          case 'maxHitPoints':
            break;
          case 'classes':
            if (!Array.isArray(value)) break;
            this[key] = value.map((v: CharacterClassInput) => new CharacterClass(v));
            break;
          default:
            if (Array.isArray(value)) break;
            (this[key] as Character[typeof key]) = value;
        }
      });
  }
}
