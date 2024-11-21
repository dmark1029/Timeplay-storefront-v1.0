// follows permutation of multiset formula
const calcPermutations = (numbers: number[]): number => {
  const factorial = (n: number): number => {
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };

  // count numbers
  const frequency: Record<number, number> = {};
  for (const number of numbers) {
    if (frequency[number]) {
      frequency[number]++;
    } else {
      frequency[number] = 1;
    }
  }

  // calculate the total permutations
  let n = numbers.length;
  let totalPermutations = factorial(n);
  let freqOfNums = 1;
  for (const key in frequency) {
    freqOfNums *= factorial(frequency[key]); // product of factorial for reoccuring numbers
  }

  return totalPermutations / freqOfNums; // n! / n1! * n2! * n3! ...
};

export default calcPermutations;
