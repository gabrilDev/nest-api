import { User } from './../../user/user.entity';

export default class TestUtil {
  static giveMeAValidUser(): User {
    const user = new User();
    user.email = 'valid@Email.com';
    user.name = 'gabiruta';
    user.id = '1';
    user.birth = '23/02/2002';
    user.password = '123456gd';
    return user;
  }
}
