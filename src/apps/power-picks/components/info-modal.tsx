import { useEffect, useState } from 'react';

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tabs,
  getKeyValue,
} from '@nextui-org/react';

import CompletedDrawsList from './draws-results';

interface PayoutTable {
  id: number;
  matches: string;
  payout: number;
  powerplayPayout: number;
}

interface InfoModalProps {
  category: string;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const InfoModal: React.FC<InfoModalProps> = ({ visible, setVisible, category }) => {
  const payout_columns = [
    { name: 'MATCHES', uid: 'matches' },
    { name: 'PAYOUT', uid: 'payout' },
    { name: 'POWERPLAY PAYOUT', uid: 'powerplayPayout' },
  ];

  const pick3_payout_rows = [
    { id: 1, matches: '3', payout: 500, powerplayPayout: 125 },
    { id: 2, matches: '2', payout: 15, powerplayPayout: 5 },
    { id: 3, matches: '1', payout: 1, powerplayPayout: 1 },
  ];

  const pick4_payout_rows = [
    { id: 1, matches: '4', payout: 5000, powerplayPayout: 1000 },
    { id: 2, matches: '3', payout: 125, powerplayPayout: 50 },
    { id: 3, matches: '2', payout: 15, powerplayPayout: 5 },
    { id: 4, matches: '1', payout: 1, powerplayPayout: 1 },
  ];
  const [tableData, setTableData] = useState<PayoutTable[]>([]);

  useEffect(() => {
    switch (category) {
      case 'pick3':
        setTableData(pick3_payout_rows);
        break;
      case 'pick4':
        setTableData(pick4_payout_rows);
        break;
      default:
        console.log('[powerpicks.InfoModal]', 'could not differentiate category, reload.');
    }
  }, [category]);

  const closeModal = () => setVisible(false);

  return (
    <Modal
      closeButton
      aria-labelledby='Select draws for your picks'
      isOpen={visible}
      onClose={closeModal}
      className='h-[80%]'
      placement='center'
    >
      <ModalContent className='modal-close-button'>
        <ModalHeader className='pb-0 font-tempo text-2xl text-pp-text-dark'>
          Information
        </ModalHeader>
        <ModalBody className='h-i flex h-[calc(100%-2.75rem)] items-center overflow-y-auto p-4'>
          <Tabs
            classNames={{
              base: 'w-full justify-center',
              tabList: 'w-full',
              panel: 'p-0 w-full',
            }}
            aria-label='Options'
          >
            <Tab key='how-to-play' title='How to Play'>
              <div className='px-6'>
                <ol className='list-outside list-decimal space-y-4'>
                  <li className='text-gray-700'>
                    Tap the <strong>Buy Tickets</strong> button or the <strong>plus (+)</strong>{' '}
                    button at the bottom right corner of the screen.
                  </li>
                  <li className='text-gray-700'>
                    Make your picks by selecting the numbers you want to play. You can make multiple
                    picks if you like. Fill out the checkout form until you are satisfied with your
                    selections.
                  </li>
                  <li className='text-gray-700'>
                    Once you are satisfied with your picks, tap the <strong>Checkout</strong>{' '}
                    button. You will then be prompted to select which draws you would like to apply
                    your picks to. After making your selections, tap <strong>Continue</strong>.
                  </li>
                  <li className='text-gray-700'>
                    Review the purchase summary carefully. If everything looks good, tap{' '}
                    <strong>Confirm Purchase</strong> to finalize your order.
                  </li>
                  <li className='text-gray-700'>
                    After purchasing, you will be redirected to the upcoming draws page. Here, you
                    can view your picks by tapping on any upcoming draws.
                  </li>
                  <li className='text-gray-700'>
                    If a draw is scheduled to occur within the next hour, you can tap the{' '}
                    <strong>Live Draw</strong> button to view the results in real-time.
                  </li>
                </ol>
              </div>
            </Tab>
            <Tab key='payouts' title='Payouts'>
              <h1 className='pb-4 font-tempo text-lg text-pp-text-dark'>
                {category === 'pick3' ? 'Pick 3' : null}
                {category === 'pick4' ? 'Pick 4' : null} Prizes & Odds
              </h1>
              <p className='pb-4'>
                If your numbers match, you could be a winner! Check the chart below to see the
                various game payouts and learn how you can win more with the addition of POWERPLAY.
              </p>
              <Table
                classNames={{
                  base: 'pb-4',
                  wrapper: 'shadow-none p-0 border-pp-text-light border',
                  th: 'font-tempo text-pp-text-light',
                }}
                aria-label='Payouts Table'
                isStriped
              >
                <TableHeader columns={payout_columns}>
                  {(column) => <TableColumn key={column.uid}>{column.name}</TableColumn>}
                </TableHeader>
                <TableBody items={tableData}>
                  {(item) => (
                    <TableRow key={item.id}>
                      {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <h1 className='pb-4 font-tempo text-lg text-pp-text-dark'>Did you win?</h1>
              <p className='pb-4'>
                To view your past wins, tap the hamburger menu located in the top right corner of
                the screen. From there, select the "History" tab to see all deposits made to your
                account.
              </p>
              <p className='pb-4'>
                If you have won an amount over <strong>$600</strong>, you will need to visit a
                customer support desk to claim your winnings.
              </p>
            </Tab>
            <Tab key='history' title='Past Numbers'>
              <CompletedDrawsList category={category}></CompletedDrawsList>
            </Tab>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default InfoModal;
