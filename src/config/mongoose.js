import mongoose from 'mongoose';

// TODO: Better way to start mongo than mongod? Consider using service?
const {MONGOOSE_CONNECT_URL} = process.env;
if(!MONGOOSE_CONNECT_URL) {
  throw new Error('Must provide MONGOOSE_CONNECT_URL in .env');
}

const MONGOOSE_CONNECT_CONFIG = { 
    useCreateIndex: true, 
    useNewUrlParser: true 
};

export default () => {
  mongoose.connect(MONGOOSE_CONNECT_URL, MONGOOSE_CONNECT_CONFIG);
  const db = mongoose.connection;
  db.on('error', console.log.bind(console, 'connection error:')); // eslint-disable-line no-console
  db.once('open', () => console.log('Open!')); // eslint-disable-line no-console
};


