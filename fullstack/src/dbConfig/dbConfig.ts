import mongoose from 'mongoose';

const mongoURL = 'mongodb://127.0.0.1:27017/otp_verification';

const connect = async () => {
  try {
    await mongoose.connect(mongoURL);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export default connect;