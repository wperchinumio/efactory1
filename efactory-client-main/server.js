const express = require('express');
const path = require('path');
const app = express();

app.set('port', (process.env.PORT || 5001))
app.use(express.static('./build'))

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, './build', 'index.html'));
})

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});