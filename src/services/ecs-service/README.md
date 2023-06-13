# ECS subsystem

Entity Component System, see more on miniplex' page at https://github.com/hmans/miniplex

Consists of:

- Entities, basically everything. At the moment we got the level and animals but this ought to be taken further
  - We already have stats, it'll get interesting when we get the animals to fight each other. This would
    warrant the creation of maybe attacking and damage components for example.
- Components, ie. entity properties. for example position which is x,y coordinates or the ui property that
  defines the character and color of an ui object.
- Archetypes, sort of filters that result a list of entities to work with. For example ui archetype has all
  the entities that we draw on top of the grid, ie. the animals. And we got movable entities, again the animals.
  UI entities do not have a velocity component at all.
- Systems, funtions that handle the entities ie. all the logic.

The ECS is dependant on the Event Bus, running the systems (logic and updates) on Tick-events. It also requires
tag functions from VanJS for generating the level element.

### Thoughts

The typing is a bit shaky as the Archetypes return Entity objects that have all of ther properties (the components)
as optional. I might be missing something, but this makes me wanna create a separate type for each archetype with
required fields.
