import bcrypt from 'bcrypt';
import UserModel from '../models/user';

const RegisterController = async (req, res) => {
    const { username, password } = req.body;

    // authentication will take approximately 13 seconds
    // https://pthree.org/wp-content/uploads/2016/06/bcrypt.png
    const hashCost = 10;
  
    try {
      const passwordHash = await bcrypt.hash(password, hashCost);
      const userDocument = new UserModel({ username, passwordHash });
      await userDocument.save();
  
      return res.status(200).send({username});
    } catch (error) {
      return res.status(400).send({
        error: 'req body should be { username, password }'
      })
    }
};

export default RegisterController;