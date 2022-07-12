'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Zion Williamson',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Timothy John Fawcett',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


const displayMovements = function (movements, sort = false) {
  // Clear the html (including tags, classes etc) - this removes existing values
  containerMovements.innerHTML = "";

  const movs = sort ? movements.slice().sort((a,b) => a - b) : movements

  // For each loop on movement argument array. Similar to rubycode using template literal
  movs.forEach(function(mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__value">${mov}€</div>
      </div>
    `;
    // adding the html onto the webpage
    containerMovements.insertAdjacentHTML('afterbegin', html);
  })
}

// displayMovements(account1.movements);

const calcPrintBalance = function(acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
  return acc.balance
}
// console.log(calcPrintBalance(account1.movements));

const calcDisplaySummary = function(acc) {
// get positive values
  const incomes = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;
  console.log(incomes);
// get negative values (math.abs gets absolute value)
  const out = acc.movements.filter(mov => mov < 0).reduce((acc,cur) => acc + cur, 0);
  console.log(out);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  // 1.2% interest whenever theirs a deposit
  const interest = acc.movements.filter(mov => mov > 0).map(mov => (mov * acc.interestRate) / 100).reduce((acc, cur) => acc + cur, 0);
  labelSumInterest.textContent = `${interest}€`
  console.log(interest);


}

// calcDisplaySummary(account1.movements);


const createUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
    .toLowerCase()
    .split(' ')
    .map(word => word[0])
    .join('');
  })
}

// console.log(accounts);

createUserNames(accounts);

const updateUI = function (acc) {
  displayMovements(acc.movements);
  calcPrintBalance(acc);
  calcDisplaySummary(acc);
}

// EVENT HANDLERS

let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // prevent form from submitting
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
    );
  console.log(currentAccount);
  // check if pin is correct
  if(currentAccount?.pin === Number(inputLoginPin.value)) {
    // display UI and Welcome Message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;

    // Clear Input Fields & focus
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // // Display Movements
    // displayMovements(currentAccount.movements);

    // // Display Balance
    // calcPrintBalance(currentAccount);

    // // Display Summary
    // calcDisplaySummary(currentAccount);

    // reformat as a function to be called and used elsewhere
    updateUI(currentAccount);
    // console.log('Login');
  }
})


btnTransfer.addEventListener('click', function(e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  if(
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username)
    {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(+amount);
    updateUI(currentAccount);
  }
})

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
  //  add movement
    currentAccount.movements.push(amount);
    // Update UI
    updateUI(currentAccount);
  }
})

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  // console.log('Delete');
  if (inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username);
      console.log(index);
      // delete account
      accounts.splice(index, 1);
      // Hide UI
      containerApp.style.opacity = 0;
    }
  inputCloseUsername.value = inputCloseUsername.value = '';
})

let sorted = false;
btnSort.addEventListener('click', function(e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
})


/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
// CODING CHALLENGE #1

// Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners
// about their dog's age, and stored the data into an array (one array for each). For
// now, they are just interested in knowing whether a dog is an adult or a puppy.
// A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years
// old.
// Your tasks:
// Create a function 'checkDogs', which accepts 2 arrays of dog's ages
// ('dogsJulia' and 'dogsKate'), and does the following things:
// 1. Julia found out that the owners of the first and the last two dogs actually have
// cats, not dogs! So create a shallow copy of Julia's array, and remove the cat
// ages from that copied array (because it's a bad practice to mutate function
// parameters)
// 2. Create an array with both Julia's (corrected) and Kate's data
// 3. For each remaining dog, log to the console whether it's an adult ("Dog number 1
// is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy
// 🐶
// ")
// 4. Run the function for both test datasets
// Test data:
// § Data 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
// § Data 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

// Tim's Solution - All Good (just forgot + 1 to the index to start at 1 not 0)
// const checkDogs = function (dogsJulia, dogsKate) {
//   const newJuliaArray = dogsJulia.slice(1, 3);
//   const allDogs = newJuliaArray.concat(dogsKate);
//   allDogs.forEach(function(d, i) {
//     if(d >= 3 ? console.log(`Dog number ${i + 1} is an adult and is ${d} years old`) : console.log(`Dog number ${i + 1} is still a puppy 🐶`));
//     console.log(``)
//   })
// }


// // Data 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
// // Data 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]
// const J = [3, 5, 2, 12, 7];
// const K = [4, 1, 15, 8, 3];

// // console.log(dogsJulia.slice(1,3));

// checkDogs(J, K);


// Coding Challenge #2

// const calcAverageHumanAge = function (ages) {
//   const humanAges = ages.map(age => age <= 2 ? 2 * age : 16 + age * 4);
//   const adultDogs = humanAges.filter(age => age >= 18);

//   console.log(ages);
//   console.log(humanAges);
//   console.log(adultDogs);

//   const average = adultDogs.reduce((acc, cur) => acc + cur, 0) / adultDogs.length;

//   console.log(average);
// }


// calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);

// CODING CHALLENGE 3
// Re-Write the calcAverageHumanAge function but as an arrow function using strings

// const calcAverageHumanAge2 = ages => ages
// .map(age => age <= 2 ? 2 * age : 16 + age * 4)
// .filter(age => age >= 18)
// .reduce((acc, age, i, arr) => acc + age / arr.length, 0);

// HOW MANY DEPOSITS IN THE BANK WITH AT LEAST $1,000

// const numDeposits1000 = accounts
//   .flatMap(acc => acc.movements)
//   .filter(move => mov >= 1000).length;
//   // with reduce
//   .reduce((count, cur) => (cur => 1000 ? count + 1 : count), 0);


//   // Create an object that contains the sum of the deposits and withdrawals
// const sums = accounts.flatMap(acc => acc.movements).reduce((sums, cur) => {
// cur > 0 ? sums.deposits += cur : sums.withdrawals += cur;
// return sums;
// }, {deposits: 0, withdrawals: 0});

// Challenge 4
const dogs = [
{ weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
{ weight: 8, curFood: 200, owners: ['Matilda'] },
{ weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
{ weight: 32, curFood: 340, owners: ['Michael'] },
];
// console.log(dogs);


dogs.forEach(dog => dog.recommendedFood = Math.trunc(dog.weight ** .75 * 28));
console.log(dogs);
const dogSarah = dogs.find(dogs => dogs.owners.includes('Sarah'));
console.log(`Sarah's Dog is Eating ${dogSarah.curFood > dogSarah.recommendedFood ? 'Too Much Food' : 'Too Little Food'}`);

const ownersEatTooMuch = dogs.filter(dog => dog.curFood >= dog.recommendedFood).flatMap(dog => dog.owners);
const ownersEatTooLittle = dogs.filter(dog => dog.curFood <= dog.recommendedFood).flatMap(dog => dog.owners);
console.log(ownersEatTooMuch, ownersEatTooLittle);

console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much!`);
console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too little!`);

console.log(dogs.some(dog => dog.recommendedFood === dog.curFood));
console.log(dogs.some(dog => dog.curFood > (dog.recommendedFood * 0.9) && dog.curFood < (dog.recommendedFood * 1.1)));
const dogsWithGoodDiet = dogs.filter(dog => dog.curFood > (dog.recommendedFood * 0.9) && dog.curFood < (dog.recommendedFood * 1.1)).flatMap(dog => dog.owners);
console.log(dogsWithGoodDiet);

const dogsSorted = dogs.slice().sort((a, b) => a.recommendedFood - b.curFood);
console.log(dogsSorted);
