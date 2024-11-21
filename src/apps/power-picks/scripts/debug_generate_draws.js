const axios = require('axios');

// Parse command line arguments
const args = process.argv.slice(2);
let gap = 30; // default gap in minutes between draws
let amount = 5; // default amount of draws to schedule
let pick = 'pick3'; // default pick type
let cancelDraws = false; // default pick type
//let url_base = "http://localhost:8000";
let url_base = 'https://local.timeplay.me/ships-service';

// process args
for (let i = 0; i < args.length; i++) {
  if (args[i] === '-g' && args[i + 1]) {
    gap = parseInt(args[i + 1]);
    i++;
  } else if (args[i] === '-a' && args[i + 1]) {
    amount = parseInt(args[i + 1]);
    i++;
  } else if (args[i] === '-p' && args[i + 1]) {
    if (args[i + 1] === 'pick3' || args[i + 1] === 'pick4') {
      pick = args[i + 1];
    } else {
      console.error("Invalid option for '-p'. Use 'pick3' or 'pick4'.");
      process.exit(1);
    }
    i++;
  } else if (args[i] === '-c') {
    cancelDraws = true;
  }
}

let data = {
  grant_type: 'password',
  client_id: 'tp-user',
  username: 'admin',
  password: 'admin',
};

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://stg-auth.timeplay.com/auth/realms/Timeplay/protocol/openid-connect/token',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  data: data,
};

axios
  .request(config)
  .then(async (response) => {
    let access_token = response.data['access_token'];

    if (cancelDraws) {
      console.log(`Cancelling all ${pick} draws...`);
      let config = {
        method: 'delete',
        maxBodyLength: Infinity,
        url: `${url_base}/ships/lottery/powerpick/${pick}/cancel`,
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      };

      axios
        .request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.log(`Generating ${amount} ${pick} draws with ${gap} minute gaps...`);
      for (let i = 0; i < amount; i++) {
        const timestamp = Date.now() + (i + 1) * 60 * 1000 * gap;
        let data = JSON.stringify({
          draw_time: timestamp,
          pick_type: pick,
        });

        let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: `${url_base}/ships/lottery/powerpick/${pick}/draw`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access_token}`,
          },
          data: data,
        };

        let res = await axios.request(config);
        console.log(res.data);
      }
    }
  })
  .catch((error) => {
    console.log(error);
  });
