const fs = require("fs").promises;

const path = require("path");
const contactsPath = path.join(__dirname, "contacts.json");

const { addSchema, schemaUpdate } = require("./joi");

const listContacts = async () => {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);
    return contacts;
  } catch (error) {
    console.error("Error in reading file:", error);
    throw error;
  }
};

const getContactById = async (contactId) => {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);
    if (!contacts.some((contact) => contact.id === contactId)) {
      throw Error(`Contact with id ${contactId} not found!`);
    }
    const contact = contacts.filter((item) => item.id === contactId);

    return contact;
  } catch (error) {
    console.error("Error in getting contact by Id:", error);
    throw error;
  }
};

const removeContact = async (contactId) => {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);
    if (contacts.some((contact) => contact.id === contactId) === false) {
      throw Error(`Contact with id ${contactId} not found!`);
    }
    const newContacts = contacts.filter((item) => item.id !== contactId);
    await fs.writeFile(contactsPath, JSON.stringify(newContacts, null, 2));
    return newContacts;
  } catch (error) {
    console.error("Error in removing contact:", error);
    throw error;
  }
};

const addContact = async (body) => {
  try {
    await addSchema.validateAsync(body, { abortEarly: false });

    const data = await fs.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);
    const newContact = { id: String(Date.now()), ...body };

    contacts.push(newContact);

    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

    return newContact;
  } catch (error) {
    console.error("Error in adding contact:", error);
    throw error;
  }
};

const updateContact = async (contactId, body) => {
  try {
    await schemaUpdate.validateAsync(body, { abortEarly: false });
    const data = await fs.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);

    const index = contacts.findIndex((contact) => contact.id === contactId);
    if (index === -1) {
      throw new Error("Contact not found");
    }

    const updatedContact = { ...contacts[index], ...body };
    contacts[index] = updatedContact;

    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return updatedContact;
  } catch (error) {
    console.error("Error in updating contact:", error);
    throw error;
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
