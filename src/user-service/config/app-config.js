const bodyParser = require('body-parser');

class AppConfig {
    constructor(app) {
        this.app = app;
      }
      includeConfig() {
        this.app.use(
            bodyParser.json(),
          );
      }
    
}
module.exports = AppConfig;
