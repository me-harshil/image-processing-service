import { Schema, model } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const imageSchema = new Schema(
    {
        imageFile: {
            type: String,
            require: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            require: true
        }
    },
    {
        timestamps: true
    }
)

imageSchema.plugin(mongooseAggregatePaginate)

const Image = model("Image", imageSchema)

export default Image;