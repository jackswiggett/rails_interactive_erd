# Admin Frontend

## Requirements
- Homebrew: <https://brew.sh>
- node: `brew install node`
- yarn: `brew install yarn`
- AWS CLI: `brew install awscli`
- A running local dev server of [lease-backend](https://github.com/Loftium/lease-backend)

## Setup
- Change directory to base of repo: `cd admin-frontend`
- Install dependencies: `yarn`
- In lease-backend, add this line to your `.env` file. Replace `<filename>` with `module.exports.output.filename` from `webpack.common.js`, e.g. `admin-frontend.v1.js`.
  - `ADMIN_FRONTEND_URL=http://localhost:9001/<filename>`
- To be able to deploy, set your AWS credentials: `aws configure`
  - You can manage your access keys [here](https://console.aws.amazon.com/iam/home?region=us-west-2#/security_credentials)

## Available Scripts

### `yarn serve`
Runs the app in development mode, and serves the `/dist` folder as a web server on <http://localhost:9001>. This allows lease-backend to load admin-frontend. By default watches files to build on change, and auto-reload browser.

### `yarn lint`
Runs ESLint to check for style errors.

### `yarn typecheck`
Compiles typescript to check for any type errors.

### `yarn dev`
Creates a dev build of app once.

### `yarn watch`
Creates a dev build of app on file changes.

### `yarn build`
Creates a production build of app once.

### `yarn upload`
Uploads most recent build to production AWS S3 bucket.

### `yarn deploy`
Runs `build`, followed by `upload`.

## Versioning

Usually the frontend does not need to be versioned on release, as it has a very quick cache expiration set in S3. If a change is being made that requires the frontend to be immediately updated with the lease-backend (e.g. breaking API changes), then you will need to manually increment the release filename in `webpack.common.js` (e.g. `admin-frontend.v1.js` -> `admin-frontend.v2.js`) as well as do the same in the production config var `ADMIN_FRONTEND_URL` in Heroku.
