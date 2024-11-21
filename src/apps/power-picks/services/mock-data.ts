export const mockData: any = {
  pick3draws: [
    {
      id: 19,
      draw_time: '0001-01-01T00:00:00Z',
      type: '',
      enabled: false,
      outcome: [1, 2, 3],
    },
    {
      id: 20,
      draw_time: '0001-01-01T00:00:00Z',
      type: '',
      enabled: false,
      outcome: null,
    },
  ],
  pick4draws: [
    {
      id: 237846,
      draw_time: '2024-04-07T11:30:00Z',
      category: 'PICK4',
    },
    {
      id: 227463,
      draw_time: '2024-04-07T12:30:00Z',
      category: 'PICK4',
    },
  ],
  pick3lines: [
    {
      id: 817232,
      purchaseDate: '2024-04-07T11:00:00Z',
      picks: [1, 2, 3],
      boxed: true,
      fireball: false,
    },
    {
      id: 817263,
      purchaseDate: '2024-04-07T12:00:00Z',
      picks: [4, 5, 6, 7],
      boxed: false,
      fireball: true,
    },
  ],
  pick4lines: [
    {
      id: 927364,
      purchaseDate: '2024-04-07T11:00:00Z',
      picks: [1, 2, 3, 4],
      boxed: true,
      fireball: false,
    },
    {
      id: 912732,
      purchaseDate: '2024-04-07T12:00:00Z',
      picks: [5, 6, 7, 8],
      boxed: false,
      fireball: true,
    },
  ],
  ticket: {
    id: 13,
    draws: [
      {
        id: 19,
        draw_time: '0001-01-01T00:00:00Z',
        type: '',
        enabled: false,
        outcome: [1, 2, 3],
      },
      {
        id: 20,
        draw_time: '0001-01-01T00:00:00Z',
        type: '',
        enabled: false,
        outcome: null,
      },
    ],
    user_id: '9924df2a-06c8-4752-b222-9208765006ff',
    lines: [
      {
        id: 27,
        ticket_id: 13,
        picks: [1, 2, 5],
        fireball_picked: false,
        line_type: 'straight',
        stake: 6,
      },
      {
        id: 28,
        ticket_id: 13,
        picks: [7, 7, 7],
        fireball_picked: true,
        line_type: 'straight',
        stake: 6,
      },
      {
        id: 29,
        ticket_id: 13,
        picks: [7, 0, 9],
        fireball_picked: false,
        line_type: 'combo',
        stake: 6,
      },
    ],
  },
};
