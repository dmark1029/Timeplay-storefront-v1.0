import React, { useEffect, useState } from 'react';

import {
  Button,
  Image,
  Listbox,
  ListboxItem,
  ListboxSection,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import {
  ShipsTransactionApiGetTransactionRequest,
  TransactionTransactionSchema,
} from 'ships-service-sdk';

import { useAppContext } from '@/contexts/app-context';
import { queryToRequest, transactionApi } from '@/services/ships-service';
import {
  AccountType,
  GameIds,
  GameVertical,
  TransactionState,
  TransactionType,
} from '@/utils/types';
import { usdFormatter } from '@/utils/util';

import { CommonScrollList } from '../../../components/scroll-list';
import {
  BreakTheBankLogo,
  CruisingForCashLogo,
  LuckyDragonLogo,
  OceanTreasureLogo,
  Pick3Logo,
  Pick4Logo,
} from '../assets/game-previews';
import { defaultCloseIcon } from '../assets/icons';

type UserHistoryProps = {};

type FilterProps = {
  selections: (gameFilters: string[], settleFilters: string[]) => void;
};

type GamePurchaseCardProps = {
  item: TransactionTransactionSchema;
};

enum FilterOptions {
  Settled = 'settled',
  Unsettled = 'unsettled,',
}

const formattedDate = (createdAt: string) => {
  const date = new Date(createdAt);
  const newDate = date
    .toLocaleString('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    })
    .replace(',', '')
    .replace(/\s(a\.m\.|p\.m\.)$/i, (match) => match.replace(/\./g, '').toUpperCase());
  return newDate;
};

const getAltGameCardText = (gameID: string) => {
  switch (gameID) {
    case GameIds.OceanTreasure:
      return 'Ocean Treasure Hunt logo';
    case GameIds.BreakTheBank:
      return 'Break the Bank logo';
    case GameIds.CruisingForCash:
      return 'Cash Celebration logo';
    case GameIds.Pick3:
      return 'Pick3';
    case GameIds.Pick4:
      return 'Pick4';
    default:
      console.error('unimplemented game alt game card text game id: ', gameID);
      return '';
  }
};

const gameLogos: Record<GameIds, string> = {
  [GameIds.OceanTreasure]: OceanTreasureLogo,
  [GameIds.BreakTheBank]: BreakTheBankLogo,
  [GameIds.CruisingForCash]: CruisingForCashLogo,
  [GameIds.LuckyDragon]: LuckyDragonLogo,
  [GameIds.Trivia]: '',
  [GameIds.Bingo]: '',
  [GameIds.WheelOfFortune]: '',
  [GameIds.FamilyFeud]: '',
  [GameIds.DealOrNoDeal]: '',
  [GameIds.Pick3]: Pick3Logo,
  [GameIds.Pick4]: Pick4Logo,
};

const Filter: React.FC<FilterProps> = ({ selections }) => {
  const [selectedGameKeys, setGameKeys] = useState<string[]>([]);
  const [selectedSettleKeys, setSettleKeys] = useState<string[]>([]);

  return (
    <div>
      <div className='mb-2 flex h-full items-center justify-between'>
        <p className='text-xl font-bold tracking-wide'>Filter</p>
        <img
          className='h-6 w-6 rounded-full text-end'
          src={defaultCloseIcon}
          alt={`close Icon`}
          onClick={() => selections([], [])}
        />
      </div>
      <div className='h-64 overflow-auto'>
        <div className='w-full rounded-small border-small border-default-200 px-1 py-2 dark:border-default-100'>
          <Listbox
            aria-label='Game selection'
            variant='flat'
            selectionMode='multiple'
            selectedKeys={selectedGameKeys}
            onSelectionChange={(keys) => setGameKeys(Array.from(keys) as string[])}
          >
            <ListboxSection>
              <ListboxItem key={GameIds.Pick3}>Pick 3</ListboxItem>
              <ListboxItem key={GameIds.Pick4}>Pick 4</ListboxItem>
              <ListboxItem key={GameIds.BreakTheBank}>DOND Beat the Banker</ListboxItem>
              <ListboxItem key={GameIds.CruisingForCash}>Cruising For Cash</ListboxItem>
              <ListboxItem key={GameIds.OceanTreasure}>Ocean Treasure</ListboxItem>
              <ListboxItem key={GameIds.LuckyDragon}>Lucky Dragon</ListboxItem>
            </ListboxSection>
          </Listbox>
          <Listbox
            aria-label='Settle selection'
            variant='flat'
            disallowEmptySelection
            selectionMode='single'
            selectedKeys={selectedSettleKeys}
            onSelectionChange={(keys) => setSettleKeys(Array.from(keys) as string[])}
          >
            <ListboxSection>
              <ListboxItem key={FilterOptions.Settled}>Settled Games</ListboxItem>
              <ListboxItem key={FilterOptions.Unsettled}>Unsettled Games</ListboxItem>
            </ListboxSection>
          </Listbox>
        </div>
      </div>
      <div className='my-4 flex justify-center'>
        <Button
          className='w-10/12 '
          radius='sm'
          color={'primary'}
          onPress={() => {
            selections(selectedGameKeys, selectedSettleKeys);
            focus();
          }}
        >
          Apply Filters
        </Button>
      </div>
      <div className='flex justify-center'>
        <Button
          className='w-10/12'
          radius='sm'
          color={'primary'}
          onPress={() => {
            setGameKeys([]);
            setSettleKeys([]);
          }}
          isDisabled={selectedGameKeys.length === 0 && selectedSettleKeys.length === 0}
        >
          Clear All
        </Button>
      </div>
    </div>
  );
};

const GamePurchaseCard: React.FC<GamePurchaseCardProps> = ({ item }) => {
  const [holdsVisible, setHoldsVisible] = useState(false);

  const id = item.uid || '-';
  const created_at = formattedDate(item.createdAt || '-');
  const gameId = item.meta?.game_id || '-';
  const cost = usdFormatter.format(Math.abs(item.amount || 0));
  const src = gameLogos[gameId as GameIds] || '';
  const holds = item.account_holds_ids;
  const ticket_num = item.meta?.quantity;
  let source;
  switch (item.source) {
    case AccountType.Casino:
      source = 'Gaming Wallet';
      break;
    case AccountType.Room:
      source = 'Folio';
      break;
    case AccountType.Lottery:
      source = 'Lottery';
      break;
    default:
      source = item.source;
  }

  const closeHandler = () => {
    setHoldsVisible(false);
  };

  const openHandler = () => {
    setHoldsVisible(true);
  };

  return (
    <>
      <Table
        classNames={{
          wrapper: 'flex space-between h-40',
          table: 'h-full',
          tbody: 'flex flex-col justify-between h-full',
        }}
        hideHeader
        aria-label='static collection table'
        role='presentation'
      >
        <TableHeader aria-hidden='true'>
          <TableColumn>Label</TableColumn>
        </TableHeader>
        <TableBody role='presentation'>
          <TableRow role='presentation'>
            <TableCell className='w-2/4 p-0 align-baseline text-primary-900' role='presentation'>
              <div className='flex flex-row justify-between'>
                <p className='text-xs uppercase leading-5'>
                  <span className='font-extrabold'>TRANSACTION ID:</span> {id}
                </p>
                {holds && (
                  <p
                    className='mb-2 flex cursor-pointer flex-row text-base font-bold leading-5 text-red-500 underline'
                    onClick={() => {
                      openHandler();
                    }}
                  >
                    {holds.length} Unresolved Payouts
                  </p>
                )}
              </div>
              <p className='text-xs'>{created_at}</p>
            </TableCell>
          </TableRow>
          <TableRow role='presentation'>
            <TableCell
              className='flex flex-row justify-between p-0 align-bottom text-primary-900'
              role='presentation'
            >
              <div className='flex flex-col justify-end font-medium'>
                <div>
                  <p className='text-xs'>
                    <span className='font-extrabold uppercase'>QUANTITY:</span> {ticket_num} Card
                    {ticket_num && ticket_num > 1 ? 's' : ''}
                  </p>
                  <p className='text-xs'>
                    <span className='font-extrabold uppercase'>Cost:</span> {cost}
                  </p>
                  <p className='text-xs'>
                    <span className='font-extrabold uppercase'>Source:</span> {source}
                  </p>
                </div>
              </div>
              <Image
                className='h-16 w-16 rounded-md text-end'
                src={src}
                alt={getAltGameCardText(gameId)}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Modal
        closeButton
        aria-labelledby='modal-title'
        isOpen={holdsVisible}
        onClose={closeHandler}
        placement='center'
      >
        <ModalContent className='modal-close-button'>
          <ModalHeader>
            <h1 id='modal-title'>Account Holds</h1>
          </ModalHeader>
          <ModalBody>
            <p>Please present yourself customer service:</p>
            <h1 className='text-base font-bold'>Hold IDs:</h1>
            <ul className='list-inside list-disc'>
              {holds?.map((hold) => <li className='text-xs'>({hold})</li>)}
            </ul>
          </ModalBody>
          <ModalFooter>
            <Button onClick={closeHandler}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const UserHistory: React.FC<UserHistoryProps> = () => {
  const { authAccount } = useAppContext();
  const [showMain, setShowMain] = useState(true);
  const [nextPurchasePage, setNextPurchasePage] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [purchaseData, setPurchaseData] = useState<TransactionTransactionSchema[]>([]);

  let gameFilters: string[] = [];
  let settleFilters: string[] = [];

  useEffect(() => {
    fetchData(true);
  }, []);

  const fetchData = async (reset: boolean) => {
    try {
      setLoading(true);

      let currData = purchaseData;
      let nextPage = nextPurchasePage;
      if (reset) {
        setPurchaseData([]);
        setNextPurchasePage(undefined);
        currData = [];
        nextPage = undefined;
      }
      let req: ShipsTransactionApiGetTransactionRequest;
      if (nextPage) {
        req = queryToRequest(nextPage);
      } else {
        let settled: boolean | undefined;
        if (settleFilters.includes(FilterOptions.Settled)) {
          settled = true;
        } else if (settleFilters.includes(FilterOptions.Unsettled)) {
          settled = false;
        }

        req = {
          transactionState: TransactionState.Success,
          transactionType: TransactionType.Charge,
          passengerId: authAccount.login?.user_info?.playerId,
          includePayout: false,
          metaSettled: settled,
          metaGameId: gameFilters,
          metaGameVertical: GameVertical.Casino,
          cursor: 0,
          limit: 5,
        };
      }
      const purchase = await transactionApi.getTransaction(req);
      setPurchaseData([...currData, ...(purchase.data.data || [])]);
      setNextPurchasePage(purchase.data.page?.next);
    } catch (err) {
      console.error(`[user-history.fetchData] ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const showFilteredResult = async (g: string[], s: string[]) => {
    gameFilters = g;
    settleFilters = s;
    setShowMain(true);
    fetchData(true);
  };

  return (
    <div>
      {showMain ? (
        <div className='h-96 overflow-auto'>
          <CommonScrollList
            loading={loading}
            onLoadMore={() => {
              fetchData(false);
            }}
            hasMore={nextPurchasePage !== undefined}
            hasError={false}
          >
            {purchaseData.map((item: TransactionTransactionSchema) => (
              <GamePurchaseCard key={`purchase_${item.uid}`} item={item} />
            ))}
          </CommonScrollList>
          {/* <Button
            className='absolute bottom-5 left-1/2 h-16 w-12 -translate-x-1/2 transform bg-transparent px-0'
            onPress={() => setShowMain(false)}
          >
            <Image
              className='mt-3 h-16 w-16 scale-90 rounded-full text-end'
              src={FilterButtonIcon}
              alt={`Filters`}
            />
          </Button> */}
        </div>
      ) : (
        <Filter
          selections={(gameFilters, settleFilters) =>
            showFilteredResult(gameFilters, settleFilters)
          }
        ></Filter>
      )}
    </div>
  );
};

export default UserHistory;
