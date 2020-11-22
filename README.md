# The Space Voyage: Journey Beyond

Available in https://rikula.github.io/lucky-wheel/

A space story game for the lucky wheels hackathon. Your a space-engineer looking for a new home planet. You will have to solve puzzles spanning multiple tabs in your browser to analyse the local planets, decrypt messages from home, and to correct the course of your spaceship.

## Intro Video

https://youtu.be/5HXUw6YXDqk

## API Usage

Used APIs (**APIs listed in bold** are from the roulette)

- **Page Visibility API**
- **ReadableStream**
- **Resize Observer API**
- Clipboard API
- Web Audio API
- Web Storage API
- Canvas API

## How to build and Run the Project

Requirements: [yarn](https://yarnpkg.com/)

Install dependencies:

```
yarn install
```

### Development

To start the app with hot module reloading run:

```
yarn start
```

Navigate to `localhost:1234` to start the game

### Production

To build the app in production mode run:

```
yarn build
```

## Link to the mobile website

https://rikula.github.io/lucky-wheel/

### Restrictions:
- The game has been developed using Android Chrome. Please use it for best results.
- In order for the game to work popups need to be enabled, please see instructions below:
- For best experience close all other tabs before you begin the game, otherwise
the player needs to navigate back to the start screen.
- The game will request clipboard access during one of the puzzles.

### Allowing popups in chrome

Chrome should prompt you to allow popups from our site. 

If not; popups can be allowed from:
1. Settings
2. Site-settings
3. Pop-ups and redirects
4. Allow `localhost:1234` & https://rikula.github.io

