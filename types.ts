
export type Direction = 'NW' | 'N' | 'NE' | 'W' | 'C' | 'E' | 'SW' | 'S' | 'SE';

export type Element = 'Air' | 'Water' | 'Fire' | 'Earth' | 'Space';

export type RoomType = 
  | 'empty'
  | 'pooja'
  | 'living'
  | 'kitchen'
  | 'master_bedroom'
  | 'guest_bedroom'
  | 'children_bedroom'
  | 'toilet'
  | 'dining'
  | 'study'
  | 'entrance'
  | 'stairs'
  | 'storage'
  | 'balcony';

export interface VastuLogic {
  status: 'ideal' | 'neutral' | 'avoid';
  reasoning: string;
  score: number;
}

export interface ZoneState {
  direction: Direction;
  roomType: RoomType;
  wallColors: string[]; // North, East, South, West wall colors
}

export interface Suggestion {
  color: string;
  name: string;
  explanation: string; // New: Explanation for why this color fits this direction
}
