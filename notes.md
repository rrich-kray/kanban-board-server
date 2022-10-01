Source: https://itnext.io/mastering-session-authentication-aa29096f6e22

- Can use "npm init esm -y" to use the import/export syntax in your Node.js application.
- Can set up the project directory structure with an "src" folder much like the frontend. Just make sure to update the "main" and "module" to look into the src folder.
- Don't forget about nodemon
- Tutorial uses a config.js file to store PORT and NODE_ENV variables
- Make sure to hash passwords before they are saved in the database
- Try using Joi for validations
- Basically the tutorial just sets req.session.user, and sends user info to the frontend
- The frontend portion of the tutorial basically involves setting state in Redux
