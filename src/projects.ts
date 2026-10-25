export type Project =
  | { number: number; status: 'upcoming' }
  | {
      number: number;
      status: 'live';
      name: string;
      description: string;
      etherscanUrl: `https://${string}`;
    };

// Replace a slot with its real name, description and verified Etherscan link at launch.
// Keep all ten slots in order. Upcoming slots deliberately have no invented details.
export const projects: readonly Project[] = [
  { number: 1, status: 'upcoming' },
  { number: 2, status: 'upcoming' },
  { number: 3, status: 'upcoming' },
  { number: 4, status: 'upcoming' },
  { number: 5, status: 'upcoming' },
  { number: 6, status: 'upcoming' },
  { number: 7, status: 'upcoming' },
  { number: 8, status: 'upcoming' },
  { number: 9, status: 'upcoming' },
  { number: 10, status: 'upcoming' },
];
