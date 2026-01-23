import mongoose, { Document, Schema } from 'mongoose';

export enum NotificationType {
    MISSION_STARTED = 'mission:started',
    MISSION_PROGRESS = 'mission:progress',
    MISSION_COMPLETED = 'mission:completed',
    MISSION_FAILED = 'mission:failed',
    SYSTEM = 'system',
}

export interface INotification extends Document {
    id: string;
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    data?: any;
    read: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
    {
        userId: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: Object.values(NotificationType),
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        data: {
            type: Schema.Types.Mixed,
        },
        read: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Add index for fetching unread notifications or recent notifications
notificationSchema.index({ userId: 1, createdAt: -1 });

const Notification = mongoose.model<INotification>('Notification', notificationSchema);

export { Notification };
