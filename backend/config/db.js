import mongoose from 'mongoose';

const ConnectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://mohit44790:O9bvzK44Muxvpqz2@cluster0.qt8ryka.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    throw error;
  }
};

export default ConnectDB;