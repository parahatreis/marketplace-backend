const Pusher = require("pusher");

const pusher = new Pusher({
    appId: "1231862",
    key: "eed31aeea3143b907f6d",
    secret: "a3111796d6c2a4c761ee",
    cluster: "ap2",
    useTLS: true
});

module.exports = pusher;

