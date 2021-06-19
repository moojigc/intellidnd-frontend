import type { Inventory } from "./Inventory";

export interface CharacterStatic {
	id: string;
	userId: string;
	guildId?: null;
	name: string;
	race: string;
	level: number;
	class?: null;
	background?: null;
	experience: number;
	armorClass: number;
	maxHp: number;
	hp: number;
	initiative: number;
	strength: number;
	dexterity: number;
	constitution: number;
	intelligence: number;
	wisdom: number;
	charisma: number;
	createdAt: number;
	modifiedAt: number;
	inventory: Inventory;
}

export interface Character extends CharacterStatic {
    update: (values: Partial<Character>) => Promise<CharacterStatic>;
	delete: () => Promise<void>;
}


