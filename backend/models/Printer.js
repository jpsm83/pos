const mongoose = require("mongoose");

const printerSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: String,
        ipAddress: { type: String, required: true },
        port: { type: Number, required: true },
        printForPos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pos", required: true }],
        business: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true },
    },
    { timestamps: true 
    }
);

module.exports = mongoose.model("Printer", printerSchema);