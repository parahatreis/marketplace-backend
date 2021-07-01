const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "1226857",
  key: "07726302cdca3a9ac9f5",
  secret: "020aba7dc1358795da43",
  cluster: "ap1",
  useTLS: true
});

module.exports = pusher;

