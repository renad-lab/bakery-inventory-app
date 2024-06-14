const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "../data/inventory.json");

const readInventory = () => {
  try {
    const data = fs.readFileSync(dataPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading inventory.json:", error);
    return [];
  }
};

const writeInventory = (inventory) => {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(inventory, null, 2));
    console.log("Inventory data saved successfully.");
  } catch (error) {
    console.error("Error writing inventory.json:", error);
  }
};

const addItem = (item) => {
  const inventory = readInventory();
  inventory.push(item);
  writeInventory(inventory);
};

const updateItem = (id, updatedItem) => {
  const inventory = readInventory();
  const index = inventory.findIndex((item) => item.id === id);
  if (index !== -1) {
    inventory[index] = { ...inventory[index], ...updatedItem };
    writeInventory(inventory);
    return true;
  }
  return false;
};

const deleteItem = (id) => {
  let inventory = readInventory();
  const initialLength = inventory.length;
  inventory = inventory.filter((item) => item.id !== id);
  if (inventory.length < initialLength) {
    writeInventory(inventory);
    return true;
  }
  return false;
};

module.exports = {
  readInventory,
  writeInventory,
  addItem,
  updateItem,
  deleteItem,
};
