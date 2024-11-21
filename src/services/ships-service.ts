import {
  Configuration,
  ContentApi,
  DefaultApi,
  ShipsAccountApi,
  ShipsActivityApi,
  ShipsInstantWinGameInstanceApi,
  ShipsInstantWinActivityApi,
  ShipsPartnerMockGuestApi,
  ShipsSessionApi,
  ShipsTransactionApi,
  ShipsTransactionApiGetTransactionRequest,
  ShipsPowerPickPowerPickTicketPurchaseApi,
} from 'ships-service-sdk';

import { checkAuthAccount } from '@/utils/timeplay';

const apiConfig = new Configuration({
  basePath: '/ships-service',
  apiKey: async () => {
    const auth = await checkAuthAccount();
    return `Bearer ${auth.login?.token?.access_token}`;
  },
});

// global instance of ships api
export const defaultApi = new DefaultApi(apiConfig);
export const accountApi = new ShipsAccountApi(apiConfig);
export const lotteryActivityApi = new ShipsInstantWinActivityApi(apiConfig);
export const instantWinInstanceApi = new ShipsInstantWinGameInstanceApi(apiConfig);
export const mockGuestApi = new ShipsPartnerMockGuestApi(apiConfig);
export const sessionApi = new ShipsSessionApi(apiConfig);
export const transactionApi = new ShipsTransactionApi(apiConfig);
export const contentApi = new ContentApi(apiConfig);
export const activityApi = new ShipsActivityApi(apiConfig);
export const powerpicksTicketPurchaseApi = new ShipsPowerPickPowerPickTicketPurchaseApi(apiConfig);

// the sdk does not expose a way to send request with raw query string,
// so we have to convert the query into request object, then send out the request
// :(
export const queryToRequest = (q: string): ShipsTransactionApiGetTransactionRequest => {
  const params = new URLSearchParams(q);
  const query: Record<string, string | string[]> = {};

  params.forEach((value, key) => {
    if (key in query) {
      if (Array.isArray(query[key])) {
        (query[key] as string[]).push(value);
      } else {
        query[key] = [query[key] as string, value];
      }
    } else {
      query[key] = value;
    }
  });

  type WritableRequest = {
    -readonly [K in keyof ShipsTransactionApiGetTransactionRequest]+?: ShipsTransactionApiGetTransactionRequest[K];
  };

  const request: WritableRequest = {};

  // Helper function to convert to string or string[]
  const convertValue = (value: string | string[]): string | string[] => {
    return Array.isArray(value) ? value : value;
  };

  if ('transaction_id' in query) {
    request.transactionId = convertValue(query.transactionId) as string;
  }
  if ('transaction_type' in query) {
    request.transactionType = convertValue(query.transactionType) as string;
  }
  if ('transaction_state' in query) {
    request.transactionState = convertValue(query.transactionState) as string;
  }
  if ('passenger_id' in query) {
    request.passengerId = convertValue(query.passenger_id) as string;
  }
  if ('folio' in query) {
    request.folio = convertValue(query.folio) as string;
  }
  if ('cabin' in query) {
    request.cabin = convertValue(query.cabin) as string;
  }
  if ('sku' in query) {
    request.sku = convertValue(query.sku) as string;
  }
  if ('device_ids' in query) {
    request.deviceIds = convertValue(query.device_ids) as string;
  }
  if ('sail_date' in query) {
    request.sailDate = Number(query.sail_date);
  }
  if ('voyage_id' in query) {
    request.voyageId = convertValue(query.voyage_id) as string;
  }
  if ('source' in query) {
    request.source = convertValue(query.source) as string;
  }
  if ('destination' in query) {
    request.destination = convertValue(query.destination) as string;
  }
  if ('created_at_start_time' in query) {
    request.createdAtStartTime = convertValue(query.created_at_start_time) as string;
  }
  if ('created_at_end_time' in query) {
    request.createdAtEndTime = convertValue(query.created_at_end_time) as string;
  }
  if ('meta.sessionId' in query) {
    request.metaSessionId = convertValue(query['meta.sessionId']) as string;
  }
  if ('meta.sessionName' in query) {
    request.metaSessionName = convertValue(query['meta.sessionName']) as string;
  }
  if ('meta.game_vertical' in query) {
    request.metaGameVertical = convertValue(query['meta.game_vertical']) as string;
  }
  if ('meta.game_category' in query) {
    request.metaGameCategory = convertValue(query['meta.game_category']) as string;
  }
  if ('meta.game_id' in query) {
    request.metaGameId = convertValue(query['meta.game_id']) as string[];
  }
  if ('meta.nickname' in query) {
    request.metaNickname = convertValue(query['meta.nickname']) as string;
  }
  if ('meta.firstname' in query) {
    request.metaFirstname = convertValue(query['meta.firstname']) as string;
  }
  if ('meta.lastname' in query) {
    request.metaLastname = convertValue(query['meta.lastname']) as string;
  }
  if ('meta.cmas_account_id' in query) {
    request.metaCmasAccountId = convertValue(query['meta.cmas_account_id']) as string;
  }
  if ('meta.cmas_card' in query) {
    request.metaCmasCard = convertValue(query['meta.cmas_card']) as string;
  }
  if ('meta.game_definition_id' in query) {
    request.metaGameDefinitionId = convertValue(query['meta.game_definition_id']) as string;
  }
  if ('meta.manual_payout' in query) {
    request.metaManualPayout = Boolean(query['meta.manual_payout']);
  }
  if ('meta.draw_id' in query) {
    const drawIdValue = convertValue(query['meta.draw_id']);
    request.metaDrawId = Array.isArray(drawIdValue)
      ? drawIdValue.map((id) => parseInt(id, 10))
      : drawIdValue.split(',').map((id) => parseInt(id.trim(), 10));
  }
  if ('meta.settled' in query) {
    request.metaSettled = Boolean(query['meta.settled']);
  }
  if ('include_payout' in query) {
    request.includePayout = Boolean(query.include_payout);
  }
  if ('order_by' in query) {
    request.orderBy = convertValue(query.order_by) as string;
  }
  if ('order' in query) {
    request.order = convertValue(query.order) as string;
  }
  if ('cursor' in query) {
    request.cursor = Number(query.cursor);
  }
  if ('limit' in query) {
    request.limit = Number(query.limit);
  }

  // Remove undefined properties
  Object.keys(request).forEach(
    (key) =>
      request[key as keyof WritableRequest] === undefined &&
      delete request[key as keyof WritableRequest],
  );

  return request as ShipsTransactionApiGetTransactionRequest;
};
