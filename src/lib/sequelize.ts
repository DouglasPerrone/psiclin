import { Sequelize } from 'sequelize';
import * as mysql2 from 'mysql2';
import UserModel from '../../models/user';
import BlogPostModel from '../../models/blogpost';
import VideoModel from '../../models/video';
import ContactModel from '../../models/contact';

const sequelize = new Sequelize(
  process.env.DB_NAME || 's1171_psiclin',
  process.env.DB_USER || 'u1171_a5yGIAUO1O',
  process.env.DB_PASS || 'h6s1HblO..U.KuYk^K4Gv5Mj',
  {
    host: process.env.DB_HOST || 'ca-02.hostmine.com.br',
    dialect: 'mysql',
    dialectModule: mysql2,
    logging: false,
  }
);

const User = UserModel(sequelize);
const BlogPost = BlogPostModel(sequelize);
const Video = VideoModel(sequelize);
const Contact = ContactModel(sequelize);

export { sequelize, User, BlogPost, Video, Contact };
