# rust-cctv-monitor
A small Node application to record the CCTV cameras in my Rust base.

The game servers allow you to request a buffer for any of your CCTV cameras via it's websocket. This application will repeatedly request frames for the cameras you specify and save them in the `frames` folder at the root of the project.