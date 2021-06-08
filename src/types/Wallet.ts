export interface Coins {
    copper: number;
	silver: number;
	electrum: number;
	gold: number;
	platinum: number;
}

export interface WalletStatic extends Coins {
	id: string;
	inventoryId: string;
	createdAt: number;
	modifiedAt: number;
}

export interface Wallet extends WalletStatic {
    update: (coins: Coins) => Promise<WalletStatic>;
}