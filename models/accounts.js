module.exports = function(sequelize, DataTypes) {

	/*User Profile Schema*/
    var User = sequelize.define("User", {

        firstname: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 100],
                isAlpha: true
            }
        },

        lastname: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 100],
                isAlpha: true
            }
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 100],
                isEmail : true
            }
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        bio: {
            type: DataTypes.TEXT,
            allowNull: false
        },

        fullname: {
            type: DataTypes.STRING, 
            allowNull: false 
        },

        profilepicture: {
            type: DataTypes.STRING,
            allowNull: false
        }
  });

  return User;
};
