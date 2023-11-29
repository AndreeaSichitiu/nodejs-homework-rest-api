const Contact = require("./schemas/contactSchema.js");
const User = require("./schemas/usersSchema.js");
const sgMail = require("@sendgrid/mail");
 

const getAllContacts = async () => {
  return Contact.find();
};
const getContactById = async (id) => {
  return Contact.findById(id);
};
const createContact = async ({ name, email, phone, favorite }) => {
  return Contact.create({ name, email, phone, favorite });
};
const deleteContact = async (id) => {
  return Contact.findByIdAndDelete(id);
};
const updateContact = async (id, data) => {
  return Contact.findByIdAndUpdate(id, data, { new: true });
};
const updateContactStatus = async (id, data) => {
  return Contact.findByIdAndUpdate(id, data, { new: true });
};

const createUser = async ({ email, password }) => {
  const userExistent = await User.findOne({ email });

  if (userExistent) {
    throw new Error("Email already in use!");
  }

  const codUnicDeVerificare = String(Date.now());

  const msg = {
    to: email,
    from: "andra28marin@yahoo.com",
    subject: "Email de verificare cont!",
    text: `Codul de verificare este ${codUnicDeVerificare} / http://localhost:3000/api/users/verify/${codUnicDeVerificare}`,
  };

  sgMail
    .send(msg)
    .then(() => console.log("Email trimis"))
    .catch(() => {
      throw new Error("Eroare la trimitere");
    });
  
  const newUser = new User({ email, password, verificationToken: codUnicDeVerificare,});
  newUser.setPassword(password);
  return await newUser.save();
};

const loginUser = async ({ email, password, token }) => {
  const user = await User.findOne({ email });

  if (!user || !user.validPassword(password)) {
    throw new Error("Wrong email or password");
  }

  user.setToken(token);
  await user.save();
  return user;
};

const findUser = async (user) => {
  const result = await User.findOne({ email: user.email });
  return result;
};

const verifyEmail = async (verificationToken) => {
  const update = { verify: true, verificationToken: null };

  const result = await User.findOneAndUpdate(
    {
      verificationToken,
    },
    { $set: update },
    { new: true }
  );
  console.log(result);
  if (!result) throw new Error("userul nu exista");
};


module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  deleteContact,
  updateContact,
  updateContactStatus,
  createUser,
  loginUser,
  findUser,
  verifyEmail,
};
