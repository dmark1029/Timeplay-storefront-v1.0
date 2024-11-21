export const GET_STACK_CONFIG_RESPONSE = {
  type: 'success',
  data: {
    game_group: {
      entertainment: {
        display_name: 'Entertainment',
        category: {
          trivia: {
            display_name: 'Trivia',
            enabled: true,
            game: {
              pickthreeplus: {
                display_name: 'Pick Three',
              },
              triviaplus: {
                display_name: 'Quiz It',
              },
              leaderboard: {
                display_name: 'Leaderboard',
              },
              genericinteractivegame: {
                display_name: 'Generic Interactive Game',
              },
            },
          },
          bingoplus: {
            display_name: 'Popup Bingo',
            enabled: true,
            game: {
              bingoplus: {
                display_name: 'Popup Bingo',
              },
            },
          },
          wof: {
            display_name: 'Wheel of Fortune',
            enabled: true,
            pos_enabled: true,
            game: {
              wof: {
                display_name: 'Wheel of Fortune',
              },
            },
          },
          'family-feud': {
            display_name: 'Family Feud',
            enabled: true,
            game: {
              'family-feud': {
                display_name: 'Family Feud',
              },
            },
          },
        },
      },
      casino: {
        display_name: 'Casino',
        category: {
          'instant-win': {
            display_name: 'Instant Win',
            enabled: true,
            game: {
              'dond-dbk': {
                display_name: 'DEAL OR NO DEAL - Beat the Banker',
                enabled: true,
              },
              'carnival-cash-celebration': {
                display_name: 'CARNIVAL CASH CELEBRATION',
                enabled: true,
              },
            },
          },
          lotto: {
            display_name: 'Lotto',
            enabled: true,
            game: {
              pick3: {
                display_name: 'Pick 3',
                enabled: true,
              },
            },
          },
        },
      },
    },
    services: {
      auth: {
        base_url: 'https://stg-auth.timeplay.com/auth',
        realm: 'Timeplay',
        jwks_urls: [
          'https://stg-auth.timeplay.com/auth/realms/Timeplay/protocol/openid-connect/certs',
        ],
      },
      sessions: {
        url_internal: 'http://sessions',
        url_external: 'https://timeplay.me/sessions',
      },
      reward_service: {
        url_internal: 'http://reward-service',
        url_external: 'https://timeplay.me/reward-service',
      },
      transaction_service: {
        url_internal: 'http://transaction-service',
        url_external: 'https://timeplay.me/transaction-service',
      },
      web_client_service: {
        url_internal: 'http://web-client-service',
        url_external: 'https://timeplay.me/web-client-service',
      },
      inventory_service: {
        url_internal: '',
        url_external: 'https://sagames-stg-api.streamsix.com/inventory-service',
      },
      dond_client_service: {
        url_internal: 'ws://dond-client-service',
        url_external: 'wss://timeplay.me/dond-client-service',
      },
    },
    ships: {
      account_cookie_name: 'auth-account',
      passenger_cookie_name: 'passenger',
      mock_guest:
        '{"lastname":"", "birthDate":"121980", "age": 41, "sailDate":"4/1/2023 12:39:44 PM", "cabin":"789", "guestId":"123", "folioNumber":"456","voyageId":"A320", "pinNumber": 1111}',
      stack_partner: 'carnival',
      auditorium_definitions: [],
      screen_ids: [],
      session_definitions: [],
    },
  },
};
