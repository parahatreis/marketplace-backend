const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "1225267",
  key: "709eabd3eef3eec200fc",
  secret: "f521a4021fffb528c538",
  cluster: "ap2",
  useTLS: true
});

module.exports = pusher;
