module.exports = function(sequelize, DataTypes) {
	
    var Messages = sequelize.define("Messages", {

    	/*Profile Picture Of Message Creator*/
        user: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        /*Message Posted*/
        message: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        /*Message Image - optional*/
        image: {
        	type: DataTypes.STRING,
        	allowNull: true
        }

        /*Time Stamp of Message created by Sequelize: created_at*/
  });

  return Messages;
};