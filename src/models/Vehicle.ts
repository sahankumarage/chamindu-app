import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVehicle extends Document {
    name: string;
    type: 'bike' | 'bicycle';
    price: number;
    contact: string;
    imageUrl: string;
    description: string;
    isAvailable: boolean;
}

const VehicleSchema: Schema = new Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['bike', 'bicycle'], required: true },
    price: { type: Number, required: true },
    contact: { type: String, required: true },
    imageUrl: { type: String, required: false },
    description: { type: String, required: false },
    isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

const Vehicle: Model<IVehicle> = mongoose.models.Vehicle || mongoose.model<IVehicle>('Vehicle', VehicleSchema);

export default Vehicle;
