const {PASSPORT_SECRET} = process.env;
if(!PASSPORT_SECRET) {
    throw new Error('Must provide PASSPORT_SECRET in .env');
}
export default PASSPORT_SECRET;