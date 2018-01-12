module.exports = function(sequelize, DataTypes) {
	
    var Followers = sequelize.define("Followers", {

    	/* User that initiated the follow action */
        initiator: {
            type: DataTypes.TINYINT,
            allowNull: false,
        },

        /* Who the user is following */
        following: {
            type: DataTypes.TINYINT,
            allowNull: false
        },

	});

  return Followers;
};
