import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDriver extends Document {
    name: string;
    type: 'bike' | 'wheel' | 'car';
    contact: string;
    location: string;
    imageUrl: string;
    status: 'active' | 'inactive';
}

const DriverSchema: Schema = new Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['bike', 'wheel', 'car'], required: true },
    contact: { type: String, required: true },
    location: { type: String, required: true },
    imageUrl: { type: String, required: false }, // Optional, can use placeholder
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

// Check if model exists before compiling to prevent OverwriteModelError
const Driver: Model<IDriver> = mongoose.models.Driver || mongoose.model<IDriver>('Driver', DriverSchema);

export default Driver;
