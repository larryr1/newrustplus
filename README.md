# rust-cctv-monitor
A small Node application to record the CCTV cameras in my Rust base.

The game servers allow you to request a buffer for any of your CCTV cameras via it's websocket. This application will repeatedly request frames for the cameras you specify and save them in the `frames` folder at the root of the project.

The idea is to be able to load the frames into some sort of timeline program and be able to scroll back to see when you get raided or when something happens. I need to work on this timeline program.