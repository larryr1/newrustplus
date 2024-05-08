import config from '../config/client-settings.mjs';
import RustPlus from '@liamcottle/rustplus.js';
import fs from 'fs';
import { labelFrame } from './image/overlay.mjs';

var rustplus = new RustPlus(config.rust.address, config.rust.port, config.steam.id, config.rust.token);

async function onConnected() {
  console.log("connected");

  for (const c of config.rust.cameras) {
    try {
      let date = new Date();
      const name = `${date.toLocaleDateString()}\n${date.toLocaleTimeString()}`;
      const fileName = c + "_" + Date.now() + ".png";
      await saveCam(c, fileName);
      await labelFrame(fileName, name);
    } catch (error) {
      console.log("Error while saving and processing frame: " + error + JSON.stringify(error));
    }
    
  };
  
  await sessionCleanup();
}

function saveCam(c, filename) {
  return new Promise(async (resolve, reject) => {
    // get a camera
    const camera = rustplus.getCamera(c);
    console.log(`Getting render for camera ${c}.`);

    // listen for events when a camera frame has been rendered, you will get a png image buffer
    camera.on('render', async (frame) => {

        console.log(`Received render for camera ${c}.`);

        // save camera frame to disk
        fs.writeFileSync(`frames/${filename}`, frame);

        // unsubscribe from camera to allow others to control it
        await camera.unsubscribe();

        resolve();
    });

    // subscribe to camera
    try {
      await camera.subscribe();
    } catch (error) {
      console.log(JSON.stringify(error));
      console.log("Error is: " + error);
      if (error.error == "not_found") {
        console.log(`Camera ${c} was not found.`);
      } else if (error.error == "access_denied") {
        console.log(`Access denied to camera ${c}.`);
      }

      reject({error: error.error});
    }
    
  });
}

function sessionCleanup() {
  rustplus.disconnect();
  setTimeout(sessionSetup, 5000);
}

function sessionSetup() {
  rustplus.removeAllListeners();
  rustplus.on('connected', onConnected);
  rustplus.connect();
}

sessionSetup();