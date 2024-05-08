// Imports
import RustPlus from "@liamcottle/rustplus.js";
import config from "../config/client-settings.mjs";
import { writeFileSync } from 'fs';
import { Console } from "console";

// Create connection

var client; 

const beginClient = () => {
  client = new RustPlus(
    config.rust.address,
    config.rust.port,
    config.steam.id,
    config.rust.token,
    config.rust.useFacepunchProxy
  );

  client.connect();
  client.once("connected", onClientConnected);
}


const onClientConnected = () => {
  console.log("Client connected.");
  client.getTeamInfo(confirmTeamInfo);
}

const confirmTeamInfo = (info) => {
  if (info.response.error) {
    client.disconnect();
    throw new Error("Error sending request for team info: " + JSON.stringify(info));
  }

  info.response.teamInfo.members.forEach(member => {
    if (member.steamId == config.steam.id && member.isOnline == true) {
      client.disconnect();
      throw new Error(`Cannot retrieve CCTV feed when the target player (${member.name}, Steam ID ${member.steamId}) is online. Please disconnect the player and try again.`);
    }
  });

  retrieveCameraFrames();
}

var waitingCamCount = config.rust.cameras.length;
const retrieveCameraFrames = () => {
  console.log("Getting camera.");

  /*config.rust.cameras.forEach(async c => {
    let completed = false;
    let cam = client.getCamera(c);
    cam.on("render", async (frame) => {
      console.log("Rendered " + c);
      writeFileSync(`${c}.png`, frame);
      await cam.unsubscribe();

      waitingCamCount--;

      if (waitingCamCount < 1) {
        sessionCleanup();
      }

      completed = true;
    });

    console.log("Subscribing to camera " + c);
    try {
      await cam.subscribe();
    } catch (error) {
      if (error.error == "not_found") {
        console.log(`Error subscribing to camera ${c} because it does not exist.`);
        waitingCamCount--;
      } else if (error.error == "access_denied") {
        console.log(`Error subscribing to camera ${c} because access was denied.`);
        waitingCamCount--;
      } else throw new Error(`Error subscribing to camera ${c}: ${JSON.stringify(error)}`);
    }

    do {} while (completed == false);
    
  });*/

  

    // listen for events when a camera frame has been rendered, you will get a png image buffer
    const c = "hewycore";
    const camera = client.getCamera(c);
      camera.on('render', async (frame) => {

        console.log("on render");

        // save camera frame to disk
        fs.writeFileSync(`${c}.png`, frame);

        // unsubscribe from camera to allow others to control it
        await camera.unsubscribe();

        sessionCleanup();
      });
    
}

const sessionCleanup = () => {
  client.disconnect();
}

beginClient();