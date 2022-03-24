import type { questionStats } from './question';
import type { lifeLine } from './lifeline';

export type gameStats = {
  questionStats: questionStats;
  usedLifeLines?: lifeLine[];
};
