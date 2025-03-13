import { DataTypes } from "sequelize";
import db from "../config/database.js";

const Mensaje = db.define('mensaje', {
    mensaje: {
        type: DataTypes.STRING(200),
        allowNull: false
    }
})

export default Mensaje