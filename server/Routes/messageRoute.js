const express = require("express"); //Import express để sử dụng Router của Express.
const {
   createMessage,
   getMessage,
} = require("../Controllers/messageController");

const router = express.Router();

router.post("/", createMessage);
router.get("/:chatId", getMessage);

module.exports = router;
