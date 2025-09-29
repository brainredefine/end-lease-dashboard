export type AssetManager = {
  name: string;
  uuid: number;
};

export const assetManagers: Record<number, AssetManager> = {
  5: { name: "Huelsbusch", uuid: 5 },
  6: { name: "Gauthier", uuid: 6 },
  7: { name: "Kempchen", uuid: 7 },
  8: { name: "Kopetzki", uuid: 8 },
  9: { name: "Schoen", uuid: 9 },
  12: { name: "Freiberger", uuid: 12 },
};
