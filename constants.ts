
import { Direction, RoomType, VastuLogic, Suggestion, Element } from './types';

export const DIRECTIONS_CONFIG: Record<Direction, { label: string; element: Element; deity: string; description: string }> = {
  NW: { label: 'North-West', element: 'Air', deity: 'Vayu', description: 'Zone of movement and change. Influences relationships and social connectivity.' },
  N: { label: 'North', element: 'Water', deity: 'Kubera', description: 'Zone of wealth and opportunities. Attracts financial growth and prosperity.' },
  NE: { label: 'North-East', element: 'Water', deity: 'Ishanya', description: 'The most sacred zone. Source of spiritual energy and mental clarity.' },
  W: { label: 'West', element: 'Space', deity: 'Varuna', description: 'Zone of gains and profits. Governs the fulfillment of desires.' },
  C: { label: 'Center', element: 'Space', deity: 'Brahma', description: 'The heart of the home. Should remain open for energy flow.' },
  E: { label: 'East', element: 'Fire', deity: 'Aditya', description: 'Zone of social associations and health. Connected to the rising sun.' },
  SW: { label: 'South-West', element: 'Earth', deity: 'Nairutya', description: 'Zone of stability and skills. Influences the strength of family bonds.' },
  S: { label: 'South', element: 'Earth', deity: 'Yama', description: 'Zone of fame and relaxation. Connected to restful energy.' },
  SE: { label: 'South-East', element: 'Fire', deity: 'Agni', description: 'Zone of fire and zeal. Critical for physical health and metabolic energy.' },
};

export const COLOR_SUGGESTIONS: Record<Direction, Suggestion[]> = {
  NW: [
    { color: '#f5f5f5', name: 'White', explanation: 'Symbolizes the purity of Air. Helps in maintaining clean social interactions.' },
    { color: '#e5e7eb', name: 'Light Grey', explanation: 'Reflects the metallic nature often associated with Vayu (Wind).' },
    { color: '#fef3c7', name: 'Cream', explanation: 'Softens the volatile energy of the North-West, bringing stability to movement.' }
  ],
  N: [
    { color: '#d1fae5', name: 'Light Green', explanation: 'Represents growth and mercury, the planet of North, attracting wealth.' },
    { color: '#dbeafe', name: 'Sky Blue', explanation: 'Enhances the Water element, promoting a steady flow of opportunities.' },
    { color: '#ffffff', name: 'White', explanation: 'Maintains the clarity required to identify new financial prospects.' }
  ],
  NE: [
    { color: '#fef3c7', name: 'Yellow', explanation: 'Symbolizes Jupiter and spiritual enlightenment, perfect for the sacred NE.' },
    { color: '#ffffff', name: 'Pure White', explanation: 'Reflects the purest vibrations of the cosmos for meditation and clarity.' },
    { color: '#e0f2fe', name: 'Azure', explanation: 'Deepens the connection with the infinite Water/Space energy of Ishanya.' }
  ],
  W: [
    { color: '#ffffff', name: 'White', explanation: 'Standard color for the West to maintain neutral energy for gains.' },
    { color: '#f1f5f9', name: 'Silver', explanation: 'Metal colors support the Space element of the West, helping in material success.' },
    { color: '#dbeafe', name: 'Blue', explanation: 'Connects with the Varuna (God of Water/Oceans) energy of the West.' }
  ],
  C: [
    { color: '#ffffff', name: 'White', explanation: 'Keeps the center light and spacious, allowing Brahma energy to expand.' },
    { color: '#fffbeb', name: 'Off-White', explanation: 'A grounding neutral that doesn\'t block the flow of cosmic energy.' }
  ],
  E: [
    { color: '#ffffff', name: 'White', explanation: 'Enhances the purity of sunlight entering from the East.' },
    { color: '#ffedd5', name: 'Light Orange', explanation: 'Mimics the rising sun, boosting social status and physical vitality.' },
    { color: '#fef3c7', name: 'Saffron', explanation: 'A holy color that resonates with the spiritual aspect of the solar energy.' }
  ],
  SW: [
    { color: '#fef3c7', name: 'Yellow', explanation: 'Strengthens the Earth element, providing stability to the household.' },
    { color: '#ffedd5', name: 'Peach', explanation: 'Warm tones encourage better relationships and family stability.' },
    { color: '#ede9fe', name: 'Earth', explanation: 'Neutral earth tones anchor the heavy energy required in the SW.' }
  ],
  S: [
    { color: '#fee2e2', name: 'Pink', explanation: 'Softer version of red; provides warmth and fame without over-excitement.' },
    { color: '#fef3c7', name: 'Light Brown', explanation: 'Grounds the South, ensuring fame is built on a solid foundation.' },
    { color: '#fecaca', name: 'Red', explanation: 'The color of Mars, ruling the South. Use sparingly for passion and vigor.' }
  ],
  SE: [
    { color: '#ffedd5', name: 'Orange', explanation: 'The color of the hearth. Directly fuels the Agni (Fire) energy of the zone.' },
    { color: '#fee2e2', name: 'Pink', explanation: 'Connects Fire with the heart, promoting domestic harmony.' },
    { color: '#ffffff', name: 'White', explanation: 'Balances the high heat of the SE, preventing aggressive energy.' }
  ],
};

export const ROOM_OPTIONS: { value: RoomType; label: string }[] = [
  { value: 'empty', label: 'Not Assigned' },
  { value: 'pooja', label: 'Pooja Room' },
  { value: 'living', label: 'Living Room' },
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'master_bedroom', label: 'Master Bedroom' },
  { value: 'guest_bedroom', label: 'Guest Bedroom' },
  { value: 'children_bedroom', label: 'Children Bedroom' },
  { value: 'toilet', label: 'Toilet/Bath' },
  { value: 'dining', label: 'Dining Hall' },
  { value: 'study', label: 'Study Room' },
  { value: 'entrance', label: 'Entrance' },
  { value: 'stairs', label: 'Staircase' },
  { value: 'storage', label: 'Storage' },
  { value: 'balcony', label: 'Balcony' },
];

export const VASTU_RULES: Record<Direction, Partial<Record<RoomType, VastuLogic>>> = {
  NE: {
    pooja: { status: 'ideal', score: 10, reasoning: 'Ishanya is the source of all positive energy. Ideal for spirituality.' },
    living: { status: 'ideal', score: 8, reasoning: 'Excellent for receiving sunlight and fresh air.' },
    toilet: { status: 'avoid', score: -10, reasoning: 'Contaminates the highest spiritual energy point of the house.' },
    kitchen: { status: 'avoid', score: -5, reasoning: 'Conflict between Water (Ishanya) and Fire (Agni/Kitchen).' },
  },
  SE: {
    kitchen: { status: 'ideal', score: 10, reasoning: 'Home of Agni (Fire). Essential for health and metabolic energy.' },
    master_bedroom: { status: 'avoid', score: -5, reasoning: 'May cause restlessness or hyper-activity.' },
    toilet: { status: 'avoid', score: -8, reasoning: 'Water in fire zone causes health imbalances.' },
  },
  SW: {
    master_bedroom: { status: 'ideal', score: 10, reasoning: 'Nairutya is the zone of Earth. Provides stability and dominance.' },
    storage: { status: 'ideal', score: 8, reasoning: 'Heavy storage here anchors the family.' },
    entrance: { status: 'avoid', score: -10, reasoning: 'Considered a "demonic" entry point; leads to instability.' },
  },
  NW: {
    guest_bedroom: { status: 'ideal', score: 8, reasoning: 'Air zone (Vayu). Ideal for movement and temporary stays.' },
    toilet: { status: 'ideal', score: 9, reasoning: 'Best for waste elimination as Air carries it out.' },
  },
  C: {
    empty: { status: 'ideal', score: 10, reasoning: 'Brahmasthan should be open to allow energy to circulate.' },
    toilet: { status: 'avoid', score: -15, reasoning: 'Fatal Vastu defect. Spreads negativity across the entire home.' },
  },
  N: {
    living: { status: 'ideal', score: 9, reasoning: 'Zone of Kubera. Attracts wealth and social prosperity.' },
    entrance: { status: 'ideal', score: 10, reasoning: 'Highly auspicious for wealth and opportunities.' },
  },
  E: {
    entrance: { status: 'ideal', score: 10, reasoning: 'The rising sun provides natural UV purification and vitamin D.' },
    study: { status: 'ideal', score: 9, reasoning: 'Enhances focus and clarity of thought.' },
  },
  S: {
    master_bedroom: { status: 'neutral', score: 5, reasoning: 'Good for sleep, but ensure heavy headboard on South wall.' },
    stairs: { status: 'ideal', score: 8, reasoning: 'Heavy structures are well suited for the South.' },
  },
  W: {
    dining: { status: 'ideal', score: 9, reasoning: 'Varuna zone. Encourages stability and good appetite.' },
    study: { status: 'neutral', score: 6, reasoning: 'Acceptable for academic success.' },
  }
};
