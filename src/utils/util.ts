import { GameIds } from './types';
import { CashCompPrizeTag } from './types';

export const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

// TODO: This system is temporary and should be replaced when localization is implemented
export const getCashCompTitleFromTag = (tag: string) => {
  switch (tag) {
    case CashCompPrizeTag.FreeCruise:
      return 'a free cruise';
    default:
      console.error(`prize ${tag} has not been implemented`);
      return 'a prize';
  }
};

export const getCashCompPrizeDisplayFromTag = (tag: string) => {
  switch (tag) {
    case CashCompPrizeTag.FreeCruise:
      return 'Cruise';
    default:
      console.error(`tag ${tag} is not implemented`);
      return '';
  }
};

export const gameLocations = {
  [GameIds.CruisingForCash]: '/games/instant-win/cruising-for-cash',
  [GameIds.BreakTheBank]: '/games/instant-win/break-the-bank',
  [GameIds.LuckyDragon]: '/games/instant-win/lucky-dragon',
  [GameIds.OceanTreasure]: '/games/instant-win/ocean-treasure-hunt',
  [GameIds.Pick3]: '/games/power-picks/pick3',
  [GameIds.Pick4]: '/games/power-picks/pick4',
  // ent games do not have url path in ships client
  [GameIds.Trivia]: undefined,
  [GameIds.Bingo]: undefined,
  [GameIds.WheelOfFortune]: undefined,
  [GameIds.FamilyFeud]: undefined,
  [GameIds.DealOrNoDeal]: undefined,
};

export const avatarIdDescMap = new Map([
  ['avatar-7', 'dolphin'],
  ['avatar-9', 'eagle'],
  ['avatar-10', 'elephant'],
  ['avatar-11', 'falcon'],
  ['avatar-12', 'gorilla'],
  ['avatar-13', 'hamster'],
  ['avatar-15', 'lady bug'],
  ['avatar-16', 'lion'],
  ['avatar-17', 'orangutan'],
  ['avatar-18', 'panda'],
  ['avatar-19', 'penguin'],
  ['avatar-20', 'polar bear'],
  ['avatar-21', 'puppy'],
  ['avatar-23', 'spider'],
  ['avatar-24', 'squirrel'],
  ['avatar-25', 'swan'],
  ['avatar-26', 'whale'],
  ['avatar-27', 'wolf'],
  ['avatar-28', 'yellow bird'],
  ['avatar-30', 'black glasses pink hair'],
  ['avatar-32', 'orange headphones'],
  ['avatar-33', 'white glasses hat'],
  ['avatar-34', 'harry potter'],
  ['avatar-38', 'black glasses black hair'],
  ['avatar-41', 'red hat and brown hair'],
  ['avatar-42', 'cowboy hat and blonde hair'],
  ['avatar-44', 'black glasses, mustache, and beard'],
  ['avatar-46', 'grey hat and mustache'],
  ['avatar-47', 'grey hat and no facial hair'],
  ['avatar-48', 'pink beanie and brown hair'],
  ['avatar-50', 'short black hair with side bangs'],
  ['avatar-52', 'baseball cap and black hair'],
  ['avatar-56', 'short blonde hair'],
  ['avatar-57', 'cowboy hat and no facial hair'],
  ['avatar-60', 'pink hair and straight bangs'],
  ['avatar-61', 'curly brown hair and flower bandana'],
  ['avatar-63', 'short red hair'],
  ['avatar-65', 'black hair, mustache, and beard'],
  ['avatar-67', 'black glasses and black fedora'],
  ['avatar-68', 'black hair and red headphones'],
  ['avatar-70', 'black hair'],
  ['avatar-73', 'baseball cap and black sunglasses'],
  ['avatar-76', 'brown cowboy hat and mustache'],
  ['avatar-77', 'black baseball hat and brown hair'],
  ['avatar-79', 'punk style with spikey black hair and leather jacket'],
  ['avatar-81', 'white beanie and brown hair'],
  ['avatar-83', 'red heart glasses and blonde hair'],
  ['avatar-86', 'brown mullet'],
  ['avatar-92', 'punk style with mohawk'],
  ['avatar-94', 'punk style with pink and grey hair'],
  ['avatar-95', 'white hair with black and purple streaks'],
  ['avatar-96', 'blonde hair in pigtails'],
  ['avatar-98', 'short brown hair and suit'],
  ['avatar-102', 'thick frame glasses and short brown hair'],
  ['avatar-105', 'sun hat and brown hair with bangs'],
  ['avatar-107', 'blue hair in ponytail'],
  ['avatar-108', 'brown pigtails'],
  ['avatar-120', 'star shaped glasses and blonde hair'],
  ['avatar-121', 'square sunglasses and brown hair'],
  ['avatar-122', 'white aviator sunglasses and brown hair'],
  ['avatar-148', 'ballet slippers'],
  ['avatar-150', 'basketball'],
  ['avatar-151', 'bike'],
  ['avatar-152', 'chess piece'],
  ['avatar-153', 'dart'],
  ['avatar-155', 'football'],
  ['avatar-157', 'hockey sticks'],
  ['avatar-158', 'checked race flag'],
  ['avatar-160', 'sailing wheel'],
  ['avatar-161', 'skiis'],
  ['avatar-162', 'snowboarder'],
  ['avatar-164', 'soccer ball'],
  ['avatar-168', 'pool table'],
  ['avatar-169', 'football helmet'],
  ['avatar-170', 'surfboard'],
  ['avatar-171', 'tennis ball'],
  ['avatar-173', 'golf club and ball'],
  ['avatar-177', 'martial arts'],
  ['avatar-179', 'baseball'],
  ['avatar-181', 'skateboard'],
  ['avatar-184', 'dirtbike'],
  ['avatar-187', 'dirtbike'],
  ['avatar-188', 'scooter'],
  ['avatar-190', 'horse'],
  ['avatar-193', 'dirtbike'],
  ['avatar-197', 'orange cat'],
  ['avatar-198', 'shark'],
  ['avatar-199', 'frog'],
  ['avatar-200', 'parrot'],
  ['avatar-201', 'fox'],
  ['avatar-203', 'bluejay'],
  ['avatar-204', 'whale tail'],
  ['avatar-206', 'tiger'],
  ['avatar-207', 'monkey'],
  ['avatar-210', 'penguin'],
  ['avatar-216', 'mouse'],
  ['avatar-217', 'sheep'],
  ['avatar-221', 'aquarius water bearer zodiac sign'],
  ['avatar-222', 'aries ram zodiac sign'],
  ['avatar-223', 'cancer crab zodiac sign'],
  ['avatar-224', 'capricorn goat zodiac sign'],
  ['avatar-225', 'gemini twins zodiac sign'],
  ['avatar-226', 'leo lion zodiac sign'],
  ['avatar-227', 'libra balance zodiac sign'],
  ['avatar-228', 'pisces fish zodiac sign'],
  ['avatar-229', 'sagittarius archer zodiac sign'],
  ['avatar-230', 'scorpio scorpion zodiac sign'],
  ['avatar-231', 'taurus bull zodiac sign'],
  ['avatar-232', 'virgo virgin zodiac sign'],
]);
