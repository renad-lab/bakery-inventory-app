const inquirer = require("inquirer");
const chalk = require("chalk");
const Table = require("cli-table");
const { nanoid } = require("nanoid");
const { faker } = require("@faker-js/faker");
const { writeJsonFile, readJsonFile } = require("./helpers");
const cliSpinners = require("cli-spinners");
const figlet = require("figlet");

const {
  readInventory,
  addItem,
  updateItem,
  deleteItem,
} = require("./services/inventory");
const { addItemToCart, getCartTotals, emptyCart } = require("./services/cart");
const {
  // askForPaymentMethod,
  performCheckout,
  writeInventoryFile,
  readInventoryFile,
  readCartFile,
  clearCartFile,
} = require("./services/checkout");

const cookieMonsterArt = `
⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬛⬛⬛⬛⬜⬜⬜⬛⬛⬛⬜⬜⬜⬜⬜⬜⬜⬜
⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬛⬜⬜⬜⬛⬛⬛⬜⬜⬜⬛⬜⬜⬜⬜⬜⬜⬜
⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬛⬜⬜⬛⬛⬜⬛⬜⬜⬜⬜⬜⬛⬜⬜⬜⬜⬜⬜
⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬛⬜⬜⬛⬛⬜⬛⬜⬛⬛⬜⬜⬛⬜⬜⬜⬜⬜⬜
⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬛⬜⬜⬜⬜⬜⬛⬜⬛⬛⬜⬜⬛⬜⬜⬜⬜⬜⬜
⬜⬜⬜⬜⬜⬜⬜⬜⬛⬛⬛⬛⬛⬛⬜⬜⬜⬛🟦⬛⬜⬜⬜⬛⬛⬛⬛⬛⬜⬜⬜
⬜⬜⬜⬜⬜⬜⬜⬜⬛🟦🟦🟦🟦🟦⬛⬛⬛⬛🟦⬛⬛⬛⬛🟦🟦🟦🟦🟦⬛⬛⬜
⬜⬜⬜⬜⬜⬜⬛⬛🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦⬛⬜
⬜⬜⬜⬜⬜⬜⬛🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦⬛
⬜⬜⬜⬜⬜⬛🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦⬛
⬜⬜⬜⬜⬜⬛🟦🟦🟦⬛⬛🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦⬛⬛⬛⬛⬛⬛⬛⬛⬜
⬜⬜⬜⬜⬜⬛⬛🟦🟦🟦🟦⬛⬛🟦🟦🟦🟦🟦🟦🟦⬛⬛⬛🟦🟦🟦🟦🟦🟦⬛⬜
⬜⬜⬜⬜⬜⬜⬛🟦🟦🟦🟦🟦🟦⬛⬛⬛⬛⬛⬛⬛🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦⬛
⬜⬜⬜⬜⬜⬜⬛🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦⬛
⬜⬜⬜⬜⬜⬜⬜⬛🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦⬛⬛⬜
⬜⬜⬜⬜⬜⬜⬛🟦⬛🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦⬛⬛⬜⬜⬜
⬜⬜⬜⬜⬜⬜⬛🟦🟦⬛⬛⬛🟦🟦🟦🟦🟦🟦🟦🟦🟦⬛⬛⬛⬛⬛⬛⬜⬜⬜⬜
⬜⬜⬜⬜⬜⬛🟦🟦🟦🟦🟦🟦⬛⬛⬛🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦⬛⬜⬜⬜⬜⬜
⬜⬜⬜⬜⬜⬛🟦🟦⬛⬛⬛⬛⬛🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦⬛⬜⬜⬜⬜⬜
⬜⬜⬜⬜⬜⬛🟦⬛🟧🟧🟧🟧🟧⬛⬛🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦⬛⬜⬜⬜⬜⬜
⬜⬜⬜⬜⬛🟦⬛🟧🟧🟫🟧🟧🟫🟧🟧⬛🟦🟦🟦🟦🟦🟦🟦🟦⬛⬜⬜⬜⬜⬜⬜
⬜⬜⬜⬛🟦⬛🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧⬛🟦🟦🟦🟦🟦🟦🟦⬛⬜⬜⬜⬜⬜⬜
⬜⬜⬜⬛🟦⬛🟧🟧🟧⬛⬛⬛⬛⬛⬛🟧⬛🟦🟦🟦🟦🟦🟦⬛⬜⬜⬜⬜⬜⬜⬜
⬜⬜⬛🟦🟦⬛🟧🟧🟧⬛🟦🟦🟦🟦🟦⬛⬛⬛🟦🟦🟦🟦🟦⬛⬜⬜⬜⬜⬜⬜⬜
⬜⬜⬛🟦🟦⬛🟧🟫🟧🟧⬛⬛🟦🟦🟦🟦🟦🟦⬛⬛🟦🟦🟦⬛⬜⬜⬜⬜⬜⬜⬜
⬜⬛🟦🟦🟦⬛🟧🟧🟧⬛🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦⬛🟦🟦⬛⬜⬜⬜⬜⬜⬜⬜
⬜⬛🟦🟦🟦⬛🟧🟧🟧⬛⬛⬛🟦🟦🟦🟦🟦🟦🟦🟦🟦⬛🟦🟦⬛⬜⬜⬜⬜⬜⬜
⬛🟦🟦🟦🟦🟦⬛🟧⬛🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦⬛🟦⬛⬜⬜⬜⬜⬜⬜
⬛🟦🟦🟦🟦🟦⬛⬛🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦⬛⬛⬜⬜⬜⬜⬜⬜
⬛🟦🟦🟦🟦🟦🟦⬛⬛⬛⬛⬛⬛⬛🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦⬛⬛⬜⬜⬜⬜⬜
⬛🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦⬛⬛🟦🟦🟦🟦🟦🟦🟦🟦🟦⬛⬜⬜⬜⬜⬜
`;

const displayBanner = () => {
  figlet("me want crazy cookie", { font: "Thin" }, (err, data) => {
    if (err) {
      console.log("Something went wrong...");
      console.dir(err);
      return;
    }
    console.log(cookieMonsterArt);
    console.log(chalk.blue(data));
    console.log(
      chalk.blue.bold(
        "\nWelcome to Cookie Monster's Craaaaazy Cookie Emporium!\n"
      )
    );
  });
};

displayBanner();

const mainMenu = async () => {
  const choices = [
    "View All Items",
    "View Item Details",
    "Add New Item",
    "Update Item",
    "Delete Item",
    "Add Item to Cart",
    "View Cart Totals",
    "Empty Cart",
    "Exit",
  ];

  const answers = await inquirer.prompt({
    name: "action",
    type: "list",
    message: chalk.blue.bold("What can I do for you today?"),
    choices,
  });

  switch (answers.action) {
    case "View All Items":
      await viewAllItems();
      break;
    case "View Item Details":
      await viewItemDetails();
      break;
    case "Add New Item":
      await addNewItem();
      break;
    case "Update Item":
      await updateExistingItem();
      break;
    case "Delete Item":
      await deleteExistingItem();
      break;
    case "Add Item to Cart":
      await addItemToCartCLI();
      break;
    case "View Cart Totals":
      await viewCartTotals();
      await askToCheckout();
      break;
    case "Empty Cart":
      await emptyCartCLI();
      break;
    case "Exit":
      console.log(chalk.green("Goodbye!"));
      process.exit();
  }

  await mainMenu();
};

const viewAllItems = async () => {
  const inventory = readInventory();

  const table = new Table({
    head: [
      chalk.bold("ID"),
      chalk.bold("Name"),
      chalk.bold("Price"),
      chalk.bold("In Stock"),
      chalk.bold("Is Vegan"),
      chalk.bold("Available Quantity"),
    ],
    colWidths: [10, 30, 10, 10, 10, 20],
  });

  inventory.forEach((item) => {
    table.push([
      item.id,
      item.name,
      (item.priceInCents / 100).toFixed(2),
      item.inStock ? chalk.green("Yes") : chalk.red("No"),
      item.isVegan ? chalk.green("Yes") : chalk.red("No"),
      item.quantity,
    ]);
  });

  console.log(chalk.blue.bold("\nInventory:"));
  console.log(table.toString());
};

const viewItemDetails = async () => {
  const { id } = await inquirer.prompt({
    name: "id",
    type: "input",
    message: chalk.blue("Enter the item ID:"),
  });

  const inventory = readInventory();
  const item = inventory.find((item) => item.id === id);

  if (item) {
    const table = new Table({
      head: [
        chalk.bold("ID"),
        chalk.bold("Name"),
        chalk.bold("Price"),
        chalk.bold("In Stock"),
        chalk.bold("Is Vegan"),
        chalk.bold("Available Quantity"),
      ],
      colWidths: [10, 30, 10, 10, 10, 20],
    });

    table.push([
      item.id,
      item.name,
      (item.priceInCents / 100).toFixed(2),
      item.inStock ? chalk.green("Yes") : chalk.red("No"),
      item.isVegan ? chalk.green("Yes") : chalk.red("No"),
      item.quantity,
    ]);

    console.log(chalk.blue.bold("\nItem Details:\n"));
    console.log(table.toString());
  } else {
    console.log(chalk.red("Item not found.\n"));
  }
};

const addNewItem = async () => {
  const inventory = readInventory();

  const answers = await inquirer.prompt([
    {
      name: "name",
      type: "input",
      message: "Enter item name:",
    },
    {
      name: "priceInCents",
      type: "number",
      message: "Enter item price (in cents):",
      validate: (value) => !isNaN(value) && value > 0,
    },
    {
      name: "inStock",
      type: "confirm",
      message: "Is the item in stock?",
    },
    {
      name: "isVegan",
      type: "confirm",
      message: "Is the item vegan?",
    },
  ]);

  const newItem = {
    id: nanoid(2),
    ...answers,

    quantity: faker.number.int(100),
  };
  addItem(newItem);
  console.log(newItem);
  console.log(chalk.green("Item added successfully!"));
};

const updateExistingItem = async () => {
  const { id } = await inquirer.prompt({
    name: "id",
    type: "input",
    message: "Enter the item ID to update:",
  });

  const updatedItem = await inquirer.prompt([
    {
      name: "name",
      type: "input",
      message: "Enter new item name:",
    },
    {
      name: "priceInCents",
      type: "number",
      message: "Enter new item price (in cents):",
      validate: (value) => !isNaN(value) && value > 0,
    },
    {
      name: "inStock",
      type: "confirm",
      message: "Is the item in stock?",
    },
    {
      name: "isVegan",
      type: "confirm",
      message: "Is the item vegan?",
    },
    {
      name: "quantity",
      type: "number",
      message: "Enter new quantity:",
      validate: (value) => !isNaN(value) && value > 0,
    },
  ]);

  await updateItem(id, updatedItem);
  console.log(chalk.green("Item updated successfully!"));
};

const deleteExistingItem = async () => {
  const { id } = await inquirer.prompt({
    name: "id",
    type: "input",
    message: "Enter the item ID to delete:",
  });

  deleteItem(id);
  console.log(chalk.green("Item deleted successfully!"));
};

const addItemToCartCLI = async () => {
  const { id, quantity } = await inquirer.prompt([
    {
      name: "id",
      type: "input",
      message: "Enter the item ID to add to cart:",
    },
    {
      name: "quantity",
      type: "number",
      message: "Enter the quantity to add:",
      validate: (value) => !isNaN(value) && value > 0,
    },
  ]);

  addItemToCart(id, quantity);
  console.log(chalk.green("Item added to cart successfully!"));
};

const viewCartTotals = async () => {
  const { totalQuantity, totalPrice } = getCartTotals();
  console.log(chalk.blue.bold("\nCart Totals:"));
  console.log("Total Quantity:", totalQuantity);
  console.log("Total Price:", totalPrice.toFixed(2));
};

// const askForPaymentMethod = async () => {
//   const { paymentMethod, creditCardNumber } = await inquirer.prompt([
//     {
//       name: "paymentMethod",
//       type: "list",
//       message: "Choose payment method:",
//       choices: ["Cash", "Card", "Gift Card"],
//     },
//     {
//       name: "creditCardNumber",
//       type: "input",
//       message: "Enter Card Number:",
//     },
//   ]);

//   console.log(chalk.blue.bold("\nCheckout:"));
//   console.log("Payment Method:", paymentMethod);
// };

const askForPaymentMethod = async () => {
  const { paymentMethod } = await inquirer.prompt({
    name: "paymentMethod",
    type: "list",
    message: "Choose payment method:",
    choices: ["Cash", "Credit Card", "Gift Card"],
  });

  let creditCardNumber;
  if (paymentMethod === "Credit Card") {
    const { creditCard } = await inquirer.prompt({
      name: "creditCard",
      type: "input",
      message: "Enter Credit Card Number:",
    });
    creditCardNumber = creditCard;
  } else if (paymentMethod === "Gift Card") {
    const { giftCard } = await inquirer.prompt({
      name: "giftCard",
      type: "input",
      message: "Enter Gift Card Number:",
    });
    // creditCardNumber = giftCard;
  }

  return { paymentMethod, creditCardNumber };
};

const askToCheckout = async () => {
  const thankYouArt = `

ᴍᴇ ᴡᴀɴᴛ ᴄᴏᴏᴋɪᴇᴇᴇᴇᴇ~~~
ᴍᴇ ᴡᴀɴᴛ more ᴄᴏᴏᴋɪᴇᴇᴇᴇᴇᴇ~~~

`;

  //   const { confirmCheckout } = await inquirer.prompt({
  //     name: "confirmCheckout",
  //     type: "confirm",
  //     message: chalk.blue.bold("Do you want to proceed with checkout?"),
  //   });

  //   if (confirmCheckout) {
  //     await askForPaymentMethod();
  //     Checkout();
  //     emptyCart();
  //     console.log(chalk.green("Thank you for your purchase!"));
  //     console.log(chalk.blue(thankYouArt));
  //   } else {
  //     console.log(chalk.red("Checkout cancelled. Returning to main menu...\n"));
  //   }
  // };

  const { confirmCheckout } = await inquirer.prompt({
    name: "confirmCheckout",
    type: "confirm",
    message: chalk.blue.bold("Do you want to proceed with checkout?"),
  });

  if (confirmCheckout) {
    const ora = (await import("ora")).default;
    const spinner = ora("Processing your order...").start();

    const timeoutId = setTimeout(() => {
      spinner.stop();
      console.log(chalk.red("Timeout: Failed to process the order in time."));
    }, 5000);

    try {
      await askForPaymentMethod();
      await performCheckout();
      emptyCart();
      clearTimeout(timeoutId);
      spinner.succeed("Order processed successfully.");
      console.log(chalk.green("Thank you for your purchase!"));
      console.log(chalk.yellow(thankYouArt));
    } catch (error) {
      clearTimeout(timeoutId);
      spinner.fail("Failed to process the order.");
      console.error(error);
    }
  } else {
    console.log(chalk.red("Checkout cancelled. Returning to main menu...\n"));
  }
};

const emptyCartCLI = async () => {
  emptyCart();
  console.log(chalk.green("Cart emptied successfully!"));
};

mainMenu();
