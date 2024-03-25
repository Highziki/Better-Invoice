const User = require('../models/User');
const Invoice = require('../models/Invoice');

const fetchInvoicesCtrl = async (req, res) => {
  try {
    const userID = res.locals.user.id;

    const user = await User.findById(userID).populate('invoices');

    return res.render('invoices/invoices', { user });
  } catch (error) {
    res.render('errorPage', { error: error.message });
  }
};

const getCreateInvoiceFormCtrl = async (req, res) => {
  try {
    const userID = res.locals.user.id;

    const user = await User.findById(userID)
      .populate('customers')
      .populate('businesses');

    const now = new Date();
    const day = now.getUTCDate().toString().padStart(2, 0);
    const month = (now.getUTCMonth() + 1).toString().padStart(2, 0);
    const year = now.getUTCFullYear();

    const curDate = `${year}-${month}-${day}`;

    const defaultDueDate = [];

    const formattedDueDate = new Date(
      Date.now() + 1000 * 60 * 60 * 24 * 15
    ).toLocaleDateString();

    const formatMonth = `${formattedDueDate[2]}/${
      formattedDueDate[0]
    }/${formattedDueDate.slice(4)}`;

    formatMonth
      .split('/')
      .reverse()
      .forEach(ele => defaultDueDate.push(ele.padStart(2, 0)));

    const dueDate = defaultDueDate.join('-');

    const invoiceNumber = Math.floor(Math.random() * 1_000_000_000);

    return res.render('invoices/createInvoice', {
      user,
      curDate,
      dueDate,
      invoiceNumber,
    });
  } catch (error) {
    res.render('errorPage', { error: error.message });
  }
};

const createInvoiceCtrl = async (req, res) => {
  try {
    const {
      business,
      customer,
      date,
      dueDate,
      number,
      items,
      quantities,
      rates,
      subTotals,
    } = req.body;

    const userID = res.locals.user.id;

    const total = subTotals.reduce((acc, cur) => (acc += +cur), 0);

    const invoice = await Invoice.create({
      business,
      customer,
      date,
      dueDate,
      number,
      items,
      quantities,
      rates,
      subTotals,
      total,
    });
    console.log(invoice);

    const user = await User.findById(userID);

    user.invoices.push(invoice._id);

    user.save();

    return res.redirect('/invoices');
  } catch (error) {
    res.render('errorPage', { error: error.message });
  }
};

module.exports = {
  getCreateInvoiceFormCtrl,
  fetchInvoicesCtrl,
  createInvoiceCtrl,
};
