## Useage
### Use the editor in your site
To include the editor in your site, include the files in the [static](/build/static) directory, and add:
```
<div id="react-editor-root"></div>
```
to your HTML file.

## Development
### Requirements
- To develop locally you must have the following programs installed on your computer:
  - Node.js version 8.11.0 or higher [Install Node](https://nodejs.org/en/download/)
  - NPM (Node Package Manager) version 5.6.0 or higher (Installed with Node.js)
- To check what version of Node.js you have after installation, open a command terminal and run `node -v`
- To check what version of NPM you have, run `npm -v`
- To update NPM, run `npm install npm@latest -g`

### Setup locally
- Open a command terminal and download the repository by running `git clone https://github.com/bradymadden97/wysiwyg-react.git`
- `cd` into `wysiwyg-react` and run `npm install`. This may take a few minutes to install all the dependencies
- Once all dependencies have been installed, run `yarn start` to start the development server and view the project locally in a browser at `localhost:3000`

### Develop locally
- All editor source code lives in the [src](/src) folder. The static `index.html` file is located in [public](public).

### Test locally
- Run `yarn start` to start the development server and view the project locally in a browser at `localhost:3000`
- The development server will watch for file changes and automatically reload the browser when necessary

### Build for deployment
- Run `yarn build` to convert the React files to static resources in the [build](/build) directory. The contents of the `build` directory can be deployed elsewhere




## Credits
This project was created with [Create React App](https://github.com/facebookincubator/create-react-app) and [react-draft-wysiwyg](https://github.com/jpuri/react-draft-wysiwyg).
