const EventEmitter = require('events');
const req = require('request');

class Player {
  constructor(key, uuid, period) {
    this.period = period;
    this.url = `https://api.hypixel.net/status?key=${key}&uuid=${uuid}`;
    this.emitter = new EventEmitter();
    this.lastState = null;
  }

  inSkyblock(data) {
    const skyblock = `{"success":true,"session":{"online":true,"gameType":"SKYBLOCK","mode":"dynamic"}}`;
    return JSON.stringify(data) === skyblock;
  }

  scan() {
    req.get({
      url: this.url,
      json: true,
      headers: {'User-Agent': 'request'},
    }, (err, res, data) => {
      if (err) {
        console.error('Error:', err);
      } else if (res.statusCode !== 200) {
        console.warn('Status:', res.statusCode);
      } else {
        const state = this.inSkyblock(data);

        if (state !== this.lastState) {
          const evt = state ? 'join' : 'quit';
          this.lastState = state;
          this.emitter.emit(evt);
        }
      }
    });
  }

  start() {
    this.interval = setInterval(() => this.scan(), this.period);
  }
}

module.exports = {
  Player,
};
