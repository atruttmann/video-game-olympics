import type { Achievement, Challenge, EventTimes, Player } from '../types';

const SPREADSHEET_ID = '1FqfNT_BxItpVCxKZtAtHrf66JDpgXIbgx3AhkJ-aq3o';

const SHEETS = {
  leaderboard: 'Leaderboard',
  challenges: 'Challenges',
  achievements: 'Post-Game Achievements',
  times: 'Times',
} as const;

type SheetRow = Record<string, string | undefined>;

type GoogleVisualizationCell = {
  v?: string | number | boolean | null;
  f?: string;
};

type GoogleVisualizationResponse = {
  status: 'ok' | 'error';
  errors?: { detailed_message?: string; message?: string; reason?: string }[];
  table: {
    cols: { label: string }[];
    rows: { c: (GoogleVisualizationCell | null)[] }[];
  };
};

export type OlympicData = {
  leaderboard: Player[];
  achievements: Achievement[];
  challenges: Challenge[];
  times: EventTimes;
};

const getCell = (row: SheetRow, key: string) => row[key]?.trim() ?? '';

const getNumberCell = (row: SheetRow, key: string) => {
  const value = Number(getCell(row, key));
  return Number.isFinite(value) ? value : 0;
};

const getUnixSecondsCell = (row: SheetRow, key: string) =>
  getNumberCell(row, key) * 1000;

const getSheetUrl = (sheetName: string, callbackName: string) => {
  const encodedSheetName = encodeURIComponent(sheetName);
  const encodedCallbackName = encodeURIComponent(callbackName);
  return `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?sheet=${encodedSheetName}&tqx=responseHandler:${encodedCallbackName}`;
};

const normalizeCell = (cell: GoogleVisualizationCell | null) => {
  if (!cell || cell.v === null || cell.v === undefined) {
    return '';
  }

  return String(cell.f ?? cell.v);
};

const toRows = (response: GoogleVisualizationResponse) => {
  const headers = response.table.cols.map((column) => column.label);

  return response.table.rows.map((row) =>
    headers.reduce<SheetRow>((sheetRow, header, index) => {
      if (header !== '') {
        sheetRow[header] = normalizeCell(row.c[index] ?? null);
      }

      return sheetRow;
    }, {})
  );
};

const fetchSheet = (sheetName: string) =>
  new Promise<SheetRow[]>((resolve, reject) => {
    const callbackName = `__vgoSheetCallback_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2)}`;
    const windowWithCallback = window as unknown as Window &
      Record<string, (response: GoogleVisualizationResponse) => void>;
    const script = document.createElement('script');

    const cleanup = () => {
      delete windowWithCallback[callbackName];
      script.remove();
    };

    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error(`Timed out loading ${sheetName}`));
    }, 10000);

    windowWithCallback[callbackName] = (response) => {
      window.clearTimeout(timeout);
      cleanup();

      if (response.status !== 'ok') {
        reject(
          new Error(
            response.errors?.[0]?.detailed_message ??
              response.errors?.[0]?.message ??
              `Failed to load ${sheetName}`
          )
        );
        return;
      }

      resolve(toRows(response));
    };

    script.src = getSheetUrl(sheetName, callbackName);
    script.async = true;
    script.onerror = () => {
      window.clearTimeout(timeout);
      cleanup();
      reject(new Error(`Failed to load ${sheetName}`));
    };

    document.head.appendChild(script);
  });

export const fetchOlympicData = async (): Promise<OlympicData> => {
  const [playerRows, achievementRows, challengeRows, timeRows] =
    await Promise.all([
      fetchSheet(SHEETS.leaderboard),
      fetchSheet(SHEETS.achievements),
      fetchSheet(SHEETS.challenges),
      fetchSheet(SHEETS.times),
    ]);

  const leaderboard = playerRows
    .map((row) => ({
      name: getCell(row, 'Name'),
      points: getNumberCell(row, 'Points'),
      avatar: getCell(row, 'Avatar'),
      lockedGames: getCell(row, 'Locked Games'),
    }))
    .filter((player) => player.name !== '')
    .sort((a, b) => b.points - a.points);

  const achievements = achievementRows
    .map((row) => ({
      description: getCell(row, 'Description'),
      icon: getCell(row, 'Icon'),
      points: getNumberCell(row, 'Points'),
      currentHolder: getCell(row, 'Current holder'),
    }))
    .filter((achievement) => achievement.description !== '');

  const challenges = challengeRows
    .map((row) => ({
      name: getCell(row, 'Challenge Name'),
      type: getCell(row, 'Challenge Type'),
      icon: getCell(row, 'Challenge Icon'),
      goldVal: getNumberCell(row, 'Gold Point Value'),
      goldWinner: getCell(row, 'Gold Winner Name'),
      silverVal: getNumberCell(row, 'Silver Point Value'),
      silverWinner: getCell(row, 'Silver Winner Name'),
      bronzeVal: getNumberCell(row, 'Bronze Point Value'),
      bronzeWinner: getCell(row, 'Bronze Winner Name'),
    }))
    .filter((challenge) => challenge.name !== '');

  const timeRow = timeRows[0];

  if (!timeRow) {
    throw new Error('Times sheet is missing a Start/End row');
  }

  const times = {
    startTime: getUnixSecondsCell(timeRow, 'Start'),
    endTime: getUnixSecondsCell(timeRow, 'End'),
  };

  if (times.startTime <= 0 || times.endTime <= 0) {
    throw new Error('Times sheet must include numeric Start and End values');
  }

  return {
    leaderboard,
    achievements,
    challenges,
    times,
  };
};
