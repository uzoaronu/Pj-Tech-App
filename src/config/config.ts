//this config is a function
export default () => ({
  jwt: { secret: process.env.SECRET_KEY },
  database: { connectionString: process.env.MONGO_URI_CONNECTION_STRING },
  port: process.env.PORT,
});

//ORDINARILLY WE DO THIS BELOW:
// NB:  install "npm i dotenv" : Dotenv loads envt variavles from a ".env file" into "process.env".

// to use it, we do: require('dotenv).config()  OR

//import 'dotenv/config'

//BUT FOR NESTJS, WE DO THIS BELOW:

//npm i --save @nestjs/config .....this package will automatically install dotenv behind the scene; give us access to "ConfigModule" and "ConfigService" which we can use globally to access out config and .env files using process.env.envfilename
