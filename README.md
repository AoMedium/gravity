# gravity (incomplete)
Active from 17 April 2018 to 6 Aug 2020
- Latest version: [v0.6.4](https://github.com/AoMedium/gravity/tree/main/versions/gravity%20v0.6.4)
## Description
A simulation for gravity bodies and systems

## Features
### Physics
- Collision (mass merging) of bodies
- Controllable craft (experimental)
- Predictive orbital path trails

### Graphics
- Orbital trails for prominent bodies (over a mass threshold)
- Dynamic shadows for bodies
- Stellar bloom
- Comet trails (dust and gas)
- Screen culling (for performance)

### Simulation manipulation
- Manual spawning of objects
- Slingshot object spawning
- Command line for changing sim options
- User spawning (with auto-orbit)

## Controls
### Camera
- Camera movement [arrow keys]
- Camera zoom [+/-]
- Zoom multiplier [9: decrease / 0: increase]
- Reset position [l]
### Time
- Time step [</>]
- Toggle Pause/Play [/]
- Reset time step to x1 [m]
### Targetting
- Select target [r: previous / y: next]
- Toggle targeting [t]
- Toggle target mode [e]
- Toggle target largest [u]

### Prediction
- Predict using other bodies [5]

### Object manipulation (only when targeting)
- Change direction [arrow keys]
- Increase velocity [']
- Decrease velocity [;]
## Spawning
- Spawn at position [mouse down]
- Cancel [esc]
- Toggle spawn roid on click [i]
- Toggle orbit target [o]


## Commands
- system
  - load [system]
  - generate [system radius] [entity count] ?[g value] ?[mass threshold]
  - save
  - compile [system representation]
  - entity
    - set
      - mass [value]
      - dx [value]
      - dy [value]
    - delete (on selected target)
  - set
    - g [value]
    - entitycap [value]
    - spawnrange [value]
    - cullrange [value]
    - typescale [value]
    - collisionmode [0: none / 1: absorb / 2: distributive]
    
- roid
  - set
    - mass [value]
    - type/disguise [type]
  - toggle
    - override
    
- set
  - viewscale [value]
  - viewscale.step [value]
  - offsetstep [value]
  - offsetstep.step [value]
  - trailwidth [value]
  - trailsamples [value]
  - trailmode [0/1]
  - trailcalcmode [0: distance / 1: angle / 2: distance amd angle]
  - spawnmode [0/1]
  - radiusconst [value]
  
- goto
  - entity [id]
  - position (not implemented)

- toggle
  - ui
  - targetcursor
  - radiuscoloring
  - clear
  - trails
  - trailnodes
  - predictpath
  - nightmode
  - trivial (true: show trivial entities)
  - renderculling
  - pause
  - shading
  - fadeatmosphere
  - usebackground
  
- info
  - mode [0/1/2/3]
  - hide (hides UI)
  
- display
  - fontsize [text type] [size]
  - mode
    - natural
    - minimal
    
- timestep
  - set [value]
  - overridemax [value]

## Changes
- See the [changelog](changelog.txt)

## Future plans
- Overhaul with OOP and TypeScript
- Rework UI for better user experience
- Add user manual for controls and commands
- JSON system representation
