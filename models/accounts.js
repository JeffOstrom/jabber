module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define("User", {

        firstname: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 50],
                isAlpha: true
            }
        },

        lastname: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 50],
                isAlpha: true
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
        }

        // bio: {
        //     type: DataTypes.TEXT,
        //     allowNull: true
        // },

        // profilepicture: {
        //     type: DataTypes.STRING,
        //     allowNull: true
        // }

  });

  return User;
};
