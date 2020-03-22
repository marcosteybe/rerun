# re&reg;un

An app providing advanced filtering of your Strava activities. Great for finding those lovely routes you have run before.

See it in action? Go to https://marcosteybe.github.io/rerun/.

## Developing

Run `npm install` to install all the required dependencies.

Run `npm run serve` (or `ng serve`) for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

Run `npm run build` (or `ng build`) to create a production build of the app. The artifacts will be stored in the `dist/` directory.

#### Branching

I'm using [GitHub Flow](https://guides.github.com/introduction/flow/). Simply create a branch from `master`, work on whatever you want to do, open a pull request and merge back to `master`.

#### Updating dependencies to latest versions

```
npm i -g npm-check-updates
ncu -u
npm install
```

## Publishing

Run `npm run publish` to create a production build and publish your local version. Navigate to https://marcosteybe.github.io/rerun/.
