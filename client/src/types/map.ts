export type Map = {
  current?: boolean;
  selected?: boolean;
  uuid: string;
  displayName: string;
  narrativeDescription: string;
  tacticalDescription: string;
  coordinates: string;
  displayIcon: string;
  listViewIcon: string;
  listViewIconTall: string;
  splash: string;
  stylizedBackgroundImage: string;
  premierBackgroundImage: string;
  assetPath: string;
  mapUrl: string;
  xMultiplier: number;
  xScalarToAdd: number;
  yMultiplier: number;
  yScalarToAdd: number;
  callouts: Callout[];
};

type Callout = {
  regionName: string;
  superRegionName: string;
  location: Location;
};

type Location = {
  x: number;
  y: number;
};
