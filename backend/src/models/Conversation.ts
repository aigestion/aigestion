import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage {
  role: 'user' | 'daniela';
  content: string;
  timestamp: Date;
}

export interface IConversation extends Document {
  chatId: string;
  userId: string;
  userName: string;
  userRole: string;
  messages: IMessage[];
  mood: 'analytical' | 'supportive' | 'strategic' | 'creative';
  lastUpdate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    role: { type: String, enum: ['user', 'daniela'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false },
);

const conversationSchema = new Schema<IConversation>(
  {
    chatId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userRole: {
      type: String,
      required: true,
    },
    messages: [messageSchema],
    mood: {
      type: String,
      enum: ['analytical', 'supportive', 'strategic', 'creative'],
      default: 'strategic',
    },
    lastUpdate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

const Conversation = mongoose.model<IConversation>('Conversation', conversationSchema);

export { Conversation };
