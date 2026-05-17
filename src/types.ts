export type Player = {
  name: string;
  points: number;
  avatar: string;
  lockedGames: string;
};

export type Achievement = {
  description: string;
  icon: string;
  points: number;
  currentHolder: string;
};

export type Challenge = {
  name: string;
  type: string;
  icon: string;
  goldVal: number;
  goldWinner: string;
  silverVal: number;
  silverWinner: string;
  bronzeVal: number;
  bronzeWinner: string;
};

export type EventTimes = {
  startTime: number;
  endTime: number;
};
