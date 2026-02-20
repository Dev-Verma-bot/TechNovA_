const app = require("./App");
const { PORT } = require("./Configuration/server_config");

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});