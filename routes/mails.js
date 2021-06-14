const Mail = require("../lib/mails");

const domainName = process.env.DOMAIN || "mydomain";

const mailsRouter = {};

mailsRouter.getAttachment = async (req, res) => {
  console.info("received GET request to attachment", req.ip, "at", new Date());
  if (!req.session.admin) return res.json(new Error("Admin Login is required"));
  try {
    const attachment = await Mail.getAttachment(req.params.id);
    res.status(200).send(attachment);
  } catch (err) {
    console.error(err);
    res.status(500).json(new Error("Failed to get attachment data"));
  }
};

mailsRouter.getAccounts = async (req, res) => {
  console.info("received GET request to accounts", req.ip, "at", new Date());
  if (!req.session.admin) return res.json(new Error("Admin Login is required"));
  try {
    const accounts = await Mail.getAccounts();
    res.status(200).json(accounts);
  } catch (err) {
    console.error(err);
    res.status(500).json(new Error("Failed to get accounts data"));
  }
};

mailsRouter.markRead = async (req, res) => {
  console.info("received GET request to mark read", req.ip, "at", new Date());
  if (!req.session.admin) return res.json(new Error("Admin Login is required"));
  try {
    const result = await Mail.markRead(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json(new Error("Failed to request to mark as read"));
  }
};

mailsRouter.getMails = async (req, res) => {
  console.info("received GET request to mails", req.ip, "at", new Date());
  if (!req.session.admin) return res.json(new Error("Admin Login is required"));
  try {
    const mails = await Mail.getMails(req.params.account, req.query);
    res.status(200).json(mails);
  } catch (err) {
    console.error(err);
    res.status(500).json(new Error("Failed to get emails data"));
  }
};

mailsRouter.getMailBody = async (req, res) => {
  console.info("received GET request to mail body", req.ip, "at", new Date());
  if (!req.session.admin) return res.json(new Error("Admin Login is required"));
  try {
    const mail = await Mail.getMailBody(req.params.id);
    res.status(200).json(mail);
  } catch (err) {
    console.error(err);
    res.status(500).json(new Error("Failed to get email content data"));
  }
};

mailsRouter.deleteMail = async (req, res) => {
  console.info(
    "received DELETE request to delete mail",
    req.ip,
    "at",
    new Date()
  );
  if (!req.session.admin) return res.json(new Error("Admin Login is required"));
  try {
    const result = await Mail.deleteMail(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json(new Error("Failed to request to delete email"));
  }
};

mailsRouter.sendMail = async (req, res) => {
  console.info("received POST request to send mail", req.ip, "at", new Date());
  if (!req.session.admin) return res.json(new Error("Admin Login is required"));
  try {
    const result = await Mail.sendMail(req.body, req.files?.attachments);
    if (result === true) res.status(200).json(result);
    else throw new Error("Sendgrid request failed");
  } catch (err) {
    console.error(err);
    res.status(500).json(new Error("Failed to request to send email"));
  }
};

mailsRouter.saveMail = async (connection, data) => {
  console.info("Received an email at", new Date());
  console.group();
  console.log("envelopeFrom:", JSON.stringify(data.envelopeFrom));
  console.log("envelopeTo:", JSON.stringify(data.envelopeTo));
  console.log("from:", data.from?.text);
  console.log("to:", data.to?.text);
  console.groupEnd();
  try {
    let isAddressCorrect = !!data.envelopeTo.find((e) => {
      const parsedAddress = e.address.split("@");
      return parsedAddress[parsedAddress.length - 1] === domainName;
    });
    if (!isAddressCorrect) {
      isAddressCorrect = !!data.to.value.find((e) => {
        const parsedAddress = e.address.split("@");
        return parsedAddress[parsedAddress.length - 1] === domainName;
      });
    }
    if (isAddressCorrect) {
      await Mail.saveMail({ ...data, read: false, label: undefined });
      console.info("Successfully saved an email");
    } else {
      console.warn("Not saved because address is wrong");
    }
  } catch (err) {
    console.error(err);
  }
};

mailsRouter.searchMail = async (req, res) => {
  console.info("received GET request to search mail", req.ip, "at", new Date());
  if (!req.session.admin) return res.json(new Error("Admin Login is required"));
  try {
    const result = await Mail.searchMail(req.params.value, req.query);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json(new Error("Failed to search email"));
  }
};

module.exports = mailsRouter;
