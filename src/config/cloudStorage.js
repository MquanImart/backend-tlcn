import { Storage } from '@google-cloud/storage'
import fs from 'fs';
import { env } from './environment.js';

// Khởi tạo Google Cloud Storage
const storage = new Storage({
  keyFilename: env.KEYFILENAME, // Đường dẫn đến file JSON
});

const bucket = storage.bucket(env.BUCKET_NAME);

const uploadImageBufferToStorage = async (buffer, destination, mimetype) => {
    try {
      const file = bucket.file(destination);
  
      console.log(`📤 Uploading file buffer to: ${destination}`);
  
      const stream = file.createWriteStream({
        metadata: {
          contentType: mimetype, // Định dạng file chính xác
          cacheControl: 'public, max-age=31536000',
        },
      });
  
      stream.end(buffer);
  
      await new Promise((resolve, reject) => {
        stream.on('finish', resolve);
        stream.on('error', reject);
      });
  
      const fileUrl = `https://storage.googleapis.com/${env.BUCKET_NAME}/${destination}`;
  
      console.log(`✅ File uploaded successfully! URL: ${fileUrl}`);
  
      return fileUrl;
    } catch (error) {
      console.error("❌ Lỗi khi upload file lên GCS:", error);
      throw error;
    }
};
  

const deleteImageFromStorage = async (fileName) => {
    try {
      await bucket.file(fileName).delete();

    } catch (error) {
      if (error.code === 404) {
        console.error("File không tồn tại!");
      } else {
        console.error("Lỗi khi xóa file:", error);
      }
      throw error;
    }
};


export const cloudStorageService = {
    uploadImageBufferToStorage,
    deleteImageFromStorage
}
  
  