import calcPermutations from './calculate_permutations';

try {
  //pick 3
  console.assert(
    calcPermutations([1, 2, 3]) == 6,
    'Pick 3 Line permutation calculation for unique values failed',
  );
  console.assert(
    calcPermutations([1, 1, 2]) == 3,
    'Pick 3 Line permutation calculation for two repeat values failed',
  );

  //pick 4
  console.assert(
    calcPermutations([1, 2, 3, 4]) == 24,
    'Pick 4 Line permutation calculation for unique values failed',
  );
  console.assert(
    calcPermutations([1, 1, 2, 3]) == 12,
    'Pick 4 Line permutation calculation for 2 repeat values failed',
  );
  console.assert(
    calcPermutations([1, 1, 2, 2]) == 6,
    'Pick 4 Line permutation calculation for 2 pairs of repeat values failed',
  );
  console.assert(
    calcPermutations([1, 1, 1, 2]) == 4,
    'Pick 4 Line permutation calculation for 3 repeat values failed',
  );

  console.log('All tests passed successfully!');
} catch (error: any) {
  console.error('Test failed: ', error.message);
}
