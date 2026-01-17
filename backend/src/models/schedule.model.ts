import mongoose from 'mongoose';

const breakSchema = new mongoose.Schema({
    startTime: { type: String, required: true }, // "14:00"
    endTime: { type: String, required: true }, // "15:00"
    label: String,
});

const scheduleSchema = new mongoose.Schema({
    salon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Salon',
        required: true,
    },
    dayOfWeek: {
        type: Number, // 0-6
        required: true,
    },
    dayName: String,
    isWorking: {
        type: Boolean,
        default: true,
    },
    startTime: {
        type: String,
        default: "09:00",
    },
    endTime: {
        type: String,
        default: "18:00",
    },
    breaks: [breakSchema],
}, {
    timestamps: true
});

// Ensure one schedule per day per salon
scheduleSchema.index({ salon: 1, dayOfWeek: 1 }, { unique: true });

const Schedule = mongoose.model('Schedule', scheduleSchema);

export default Schedule;
