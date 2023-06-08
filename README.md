# Animalfarm web-app experimentation.

## Getting started

All the usual stuff, clone the repo, install deps. I've been using yarn as the package manager so the lock-files are as such. Not that it matters much.
The front-end is in the `src/` directory as per usual and the back-end resides under `server/`

## Used tech
- https://www.typescriptlang.org/ Typescript is being used both on the front- and the back-end.
- https://vitejs.dev/ for front-end development and building.
- https://vanjs.org/ for DOM generation and manipulation.
- https://www.thisdot.co/blog/how-to-implement-an-event-bus-in-typescript/ Event Bus System

Installed npm dependencies:
- https://github.com/hmans/miniplex Slim Entity Component System.
- https://date-fns.org/ for handing Dates.
- https://github.com/oculus42/short-uuid Handy short uuid generator, I like them short, easier to memorize!
- And at the moment for the back-end:
  - https://expressjs.com/ as the go-to choice for server framework.
  - https://socket.io/ the duplex messaging system, websocket probably.

### Libraries needed
- Pathfinding https://github.com/digitsensitive/astar-typescript maybe?


## Current state
Well, yeah, lol. Everything so far has been thrown together and the POC works. Code has to be reorganized better and documented more.

### Front-end
#### UI 
The UI is implemented entirely with VanJS. It's been fun and also pain to work with after using more fully-fledged frameworks and HTML-templates. Describing user interface with Typescript only is not very convenient, but it has it's peculiar charm and it has integrated nicely with the miniplex. There's an ECS system that generates a div element showing a map according to the data in the entities.

As this whole project is somewhat DIY, I implemented routing of sorts with `window.location.pathname`s loading different views. The views themselves are just functions that output DOM elements to there's all sorts of shenanigans that could be dome with them. The refreshes are triggered by different types of events manually.

Styling is a mess too, just a single CSS file i threw together to get the basic layout POCed.  Using classes with VanJS is easy, I just need to figure out how to divide the classes to separate files. It's been a while since I've written any CSS besides usility classes from Tailwind so I don't want to go there, but not to go too bare-bones I've thought about maybe setting up postcss.

#### ECS
Lot of comments in the files under ecs dir.

#### Event Bus
Works as expected nothing fancy here. At the moment it's only used for the ECS subscribing to socket Tick events, but I can imagine it doing much more in the Socket<->ECS integration department.

I just had a revelation: maybe try using Event Bus as the glue between all the parts of the app.

#### Socket
At the moment the socket is part of humungous App singleton class. It's a given it'll be one of the first pieces to get separated from the App.

#### Concerns et al.
The ECS is a big pile of exported functions working with module-global objects. Not the best solution, maybe?

Maybe there's no need to stick to one pattern as they both seem to be working.

### Back-end
The backend is in quite rudimentary condition and serves only as a POC with socket.io set up. I originally wrote the whole thing to be a SPA with no server-side at all, but the curiosity got the best of me.

It's a pretty big question whetyher or not we want to add database to the mix, but I've been eyeing TypeORM as a clear contender. It's been a while since I've used any sort of ORMs and from what I gather this is NOT hibernate :).

### APIs and other interoperation
At the moment there's common.ts file in the project root. This file includes interfaces for data types shared between the fe and be. I think MOST of the data types should be used on both so this will probably be turned to a directory and separate files. This out-of-source-dirs approach seems to be working fine, but it remains to be seen if it works in the long run.

The communication is done by socket.io events and I've only scratched the surface of possibilities with the current version. This means there's no HTTP REST API. The events and their args can be fully typed so it's pretty cool. Dunno if it's smart at all but we're not at work here, relax.

One idea that sprung to mind is to setup a separate data microservice with a REST API that the basic backend could use and work as a gateway.

## Goals

Some sort of farm simulator/roguelike.
Testbed for:
- Typescript, I want to familiarize myself with it.
- Cool libraries.
- Software patterns.
- AI stuff, nothing big or mainstream but homebrew simple stuff.


