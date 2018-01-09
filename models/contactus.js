module.exports = function(sequelize, DataTypes) {
    var Contact = sequelize.define("Contact", {

        name: {
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

        contact: {
            type: DataTypes.STRING,
            allowNull: false,
            isNumeric: true,          
            isInt: true
        },

        message: {
            type: DataTypes.TEXT,
            allowNull: true
        },
  });

  return Contact;
};
