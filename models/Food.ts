import mongoose, {Schema, Document} from 'mongoose';

interface FoodDoc extends Document{
    vandorId: string;
    name: string;
    description: string;
    category: string;
    foodType: string;
    readyTime: number;
    price: number;
    rating: number;
    count: number;
    isFavourite: boolean;
    images: [string];
}

const FoodSchema = new Schema({
    vandorId:{type: String},
    name:{type: String, required: true},
    description:{type: String, required: true},
    category:{type: String},
    foodType:{type: String, required: true},
    readyTime:{type: Number},
    price:{type: Number, required: true},
    rating:{type: Number},
    count:{type: Number},
    isFavourite: {type: Boolean},
    images: {type: [String]}
},{
    toJSON:{
        transform(doc, ret){
            delete ret.__v,
            delete ret.createdAt,
            delete ret.updatedAt
        }
    },
    timestamps: true
})
const Food = mongoose.model<FoodDoc>('food', FoodSchema);

export {Food};