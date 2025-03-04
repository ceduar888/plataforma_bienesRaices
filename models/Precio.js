import { DataTypes } from "sequelize";
import db from "../config/database.js";

const Precio = db.define('precio', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

export default Precio