# Event bus subsystem

I've been fascinated with these for some time now, but haven't found any practical use for them,
so I decided to implement one (or rather copypaste an implementation) and figure out what to use
it for later on. At the moment I'm thinking of wiring it to a backend with socket.io to enable
all sorts of multiuser (or -player?) features.

At the moment only 'tick' event is in use and it only runs the ECS update functions.

Great blog post that I got the implementation from: https://www.thisdot.co/blog/how-to-implement-an-event-bus-in-typescript/
