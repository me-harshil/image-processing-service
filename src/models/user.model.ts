import { model, Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import bcrypt from "bcryptjs"
import jwt, { SignOptions } from "jsonwebtoken"
import config from "@/config/config";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    password: {
        type: String,
        required: [true, "Password is required."]
    },
    images: [{
        type: Schema.Types.ObjectId,
        ref: "Image"
    }],
    refreshToken: {
        type: String
    }
}, {
    timestamps: true
});

// userSchema.plugin(mongooseAggregatePaginate);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next()
})

userSchema.methods.isPasswordCorrect = async function (password: string) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({ id: this._id, username: this.username }, config.ACCESS_TOKEN_SECRET, { expiresIn: config.ACCESS_TOKEN_EXPIRY } as SignOptions)
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({ id: this.id }, config.REFRESH_TOKEN_SECRET, { expiresIn: config.REFRESH_TOKEN_EXPIRY } as SignOptions)
}

const User = model('User', userSchema);

export default User;