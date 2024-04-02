const User = require('../models/User');
const Invoice = require('../models/Invoice');
const Business = require('../models/Business');
const Customer = require('../models/Customer');

function dateFormatter() {
  const defaultDueDate = [];

  const formattedDueDate = new Date(
    Date.now() + 1000 * 60 * 60 * 24 * 15
  ).toLocaleDateString();

  let formatMonth;
  if (
    formattedDueDate.length === 9 &&
    formattedDueDate.slice(0, 2).includes('/')
  ) {
    formatMonth = `${formattedDueDate.slice(2, 4)}/${
      formattedDueDate[0]
    }${formattedDueDate.slice(4)}`;
  } else if (
    !formattedDueDate.slice(0, 2).includes('/') &&
    !formattedDueDate.length > 9
  ) {
    formatMonth = `${formattedDueDate[3]}/${formattedDueDate.slice(
      0,
      2
    )}${formattedDueDate.slice(4)}`;
  } else {
    formatMonth = `${formattedDueDate.slice(3, 5)}/${formattedDueDate.slice(
      0,
      2
    )}${formattedDueDate.slice(5)}`;
  }

  formatMonth
    .split('/')
    .reverse()
    .forEach(ele => {
      defaultDueDate.push(ele.padStart(2, 0));
    });

  return defaultDueDate;
}

const fetchInvoicesCtrl = async (req, res) => {
  try {
    const userID = res.locals.user.id;

    const user = await User.findById(userID)
      .populate({
        path: 'invoices',
        populate: { path: 'business' },
      })
      .populate({
        path: 'invoices',
        populate: { path: 'customer' },
      });
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

    const defaultDueDate = dateFormatter();

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
      tax,
    } = req.body;

    const userID = res.locals.user.id;

    const subTotals = [];

    if (typeof quantities === 'object') {
      quantities.forEach((quantity, i) => {
        subTotals.push(quantity * rates[i]);
      });
    } else {
      subTotals.push(quantities * rates);
    }

    const total = subTotals.reduce((acc, cur) => (acc += +cur), 0);
    const grandTotal = total + (+tax / 100) * total;

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
      grandTotal,
      tax,
      total,
    });

    const user = await User.findById(userID);

    const businessFound = await Business.findById(business);
    const customerFound = await Customer.findById(customer);

    user.invoices.push(invoice._id);
    businessFound.invoices.push(invoice._id);
    customerFound.invoices.push(invoice._id);

    user.save();
    businessFound.save();
    customerFound.save();

    return res.redirect('/invoices');
  } catch (error) {
    res.render('errorPage', { error: error.message });
  }
};

const fetchInvoiceCtrl = async (req, res) => {
  try {
    const invoiceID = req.params.id;

    const invoice = await Invoice.findById(invoiceID)
      .populate('business')
      .populate('customer');

    res.render('invoices/invoiceDetails', { invoice });
  } catch (error) {
    res.render('errorPage', { error: error.message });
  }
};

const invoiceDetailsCtrl = async (req, res) => {
  try {
    const invoiceID = req.params.id;

    const invoice = await Invoice.findById(invoiceID)
      .populate('business')
      .populate('customer');

    res.render('invoices/updateInvoice', { invoice });
  } catch (error) {
    res.render('errorPage', { error: error.message });
  }
};

const updateInvoiceCtrl = async (req, res) => {
  try {
    const invoiceID = req.params.id;

    const { date, dueDate, items, quantities, rates, tax } = req.body;

    const subTotals = [];

    if (typeof quantities === 'object') {
      quantities.forEach((quantity, i) => {
        subTotals.push(quantity * rates[i]);
      });
    } else {
      subTotals.push(quantities * rates);
    }

    const total = subTotals.reduce((acc, cur) => (acc += +cur), 0);
    const grandTotal = total + (+tax / 100) * total;

    const invoice = await Invoice.findByIdAndUpdate(invoiceID, {
      date,
      dueDate,
      items,
      quantities,
      rates,
      subTotals,
      grandTotal,
      tax,
      total,
    });

    invoice.save();

    res.redirect(`/invoices/invoice/${invoice._id}`);
  } catch (error) {
    res.render('errorPage', { error: error.message });
  }
};

const deleteInvoiceCtrl = async (req, res) => {
  try {
    const invoiceID = req.params.id;

    const invoice = await Invoice.findByIdAndDelete(invoiceID);

    res.redirect('/invoices');
  } catch (error) {
    res.render('errorPage', { error: error.message });
  }
};

module.exports = {
  getCreateInvoiceFormCtrl,
  fetchInvoicesCtrl,
  createInvoiceCtrl,
  fetchInvoiceCtrl,
  invoiceDetailsCtrl,
  updateInvoiceCtrl,
  deleteInvoiceCtrl,
};
