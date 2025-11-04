const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class BlogPost extends Model {}
  BlogPost.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    coverImageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dataAiHint: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    sequelize,
    modelName: 'BlogPost',
    tableName: 'BlogPosts',
    timestamps: false,
  });
  return BlogPost;
};
