import rustPlusConfig from './rustplus.config.json' assert { type: "json" };

const config = {};
config.rust = {};
config.rust.cameras = [];
config.steam = {};

config.rust.address = "199.231.233.57";
config.rust.port = 28086;
config.rust.token = "-108846810";
config.rust.useFacepunchProxy = false;

config.rust.cameras = ["hewyfoyer", "hewyairlock1", "hewyairlock2", "hewycore", "hewyfurnaces", "testcam"];
//config.rust.cameras = ["hewyairlock1"];

config.steam.id = "76561198055462731";


export default config;