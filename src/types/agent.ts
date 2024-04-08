export type Agent = {
  selected?: boolean;
  uuid: string;
  displayName: string;
  description: string;
  developerName: string;
  characterTags: string[];
  displayIcon: string;
  displayIconSmall: string;
  bustPortrait: string;
  fullPortrait: string;
  fullPortrait2: string;
  killFeedPortrait: string;
  background: string;
  backgroundGradientColors: string[];
  assetPath: string;
  isFullPortraitRightFacing: boolean;
  isPlayableCharacter: boolean;
  isAvailableForTest: boolean;
  isBaseContent: boolean;
  role: role;
  recruitmentData: recruitmentData;
  abilities: abilities[];
  voiceLine: voiceLine;
};

type role = {
  uuid: string;
  displayName: string;
  description: string;
  displayIcon: string;
  assetPath: boolean;
};

type recruitmentData = {
  counterId: string;
  mileStoneId: string;
  mileStoneThreshold: number;
  useLevelVpCostOverride: boolean;
  levelVpCostOverride: number;
  startDate: string;
  endDate: string;
};

type abilities = {
  slot: string;
  displayName: string;
  description: string;
  displayIcon: string;
};

type voiceLine = {
  minDuration: number;
  maxDuration: number;
  mediaList: mediaList[];
};

type mediaList = {
  id: number;
  wwise: string;
  wave: string;
};
