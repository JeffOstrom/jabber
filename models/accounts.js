module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define("User", {

        firstname: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 50]
            }
        },

        lastname: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
            len: [1, 50]
            }
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
            len: [1, 50],
            isEmail : true
            }
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
            len: [1, 50]
            }
        },

        bio: {
            type: DataTypes.TEXT
        }

        // profilepicture: {
        //     type: DataTypes.text
        // },

  });

  return User;
};