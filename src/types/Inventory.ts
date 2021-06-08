import type { Wallet } from "./Wallet";

export interface Item {
    id: string;
    name: string;
    value: number | null;
    type: 'potion' | 'weapon' | 'misc';
};

export interface InventoryStatic {
	id: string;
	characterId: string;
	createdAt: number;
	modifiedAt: number;
	items: Item[];
	wallet: Wallet;
};

export interface Inventory extends InventoryStatic {
    addItem: (item: Item) => Promise<Item>;
    removeItem: (itemId: string) => Promise<void>;
    updateItem: (itemId: string, item: Partial<Item>) => Promise<Item>;
};