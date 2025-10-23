from supabase import create_client, Client
from typing import Optional, Union, BinaryIO
import uuid
import os
from PIL import Image
from io import BytesIO
from app.core.config import settings
from app.core.logging import get_logger
from app.core.exceptions import ValidationException

logger = get_logger("supabase_storage")

class SupabaseStorageClient:
    def __init__(self):
        self._client: Optional[Client] = None
    
    @property
    def client(self) -> Client:
        if self._client is None:
            self._client = create_client(
                settings.SUPABASE_URL,
                settings.SUPABASE_SERVICE_ROLE_KEY
            )
        return self._client
    
    def upload_file(
        self,
        bucket_name: str,
        file_path: str,
        file_data: Union[bytes, BinaryIO],
        content_type: Optional[str] = None,
        public: bool = True
    ) -> str:
        """
        Upload a file to Supabase Storage
        """
        try:
            # Ensure bucket exists
            self._ensure_bucket_exists(bucket_name)
            
            # Upload file
            response = self.client.storage.from_(bucket_name).upload(
                file_path,
                file_data,
                file_options={
                    "content-type": content_type,
                    "upsert": True
                }
            )
            
            if public:
                # Make file public
                self.client.storage.from_(bucket_name).update_public_access(file_path, True)
            
            # Get public URL
            public_url = self.client.storage.from_(bucket_name).get_public_url(file_path)
            return public_url
            
        except Exception as e:
            logger.error(f"Failed to upload file to Supabase Storage: {str(e)}")
            raise ValidationException(f"Failed to upload file: {str(e)}")
    
    def delete_file(self, bucket_name: str, file_path: str) -> bool:
        """
        Delete a file from Supabase Storage
        """
        try:
            self.client.storage.from_(bucket_name).remove([file_path])
            return True
        except Exception as e:
            logger.error(f"Failed to delete file from Supabase Storage: {str(e)}")
            return False
    
    def get_public_url(self, bucket_name: str, file_path: str) -> str:
        """
        Get public URL for a file
        """
        try:
            return self.client.storage.from_(bucket_name).get_public_url(file_path)
        except Exception as e:
            logger.error(f"Failed to get public URL: {str(e)}")
            raise ValidationException(f"Failed to get public URL: {str(e)}")
    
    def _ensure_bucket_exists(self, bucket_name: str):
        """
        Ensure bucket exists in Supabase Storage
        """
        try:
            # List buckets to check if it exists
            buckets = self.client.storage.list_buckets()
            bucket_names = [bucket.name for bucket in buckets]
            
            if bucket_name not in bucket_names:
                # Create bucket if it doesn't exist
                self.client.storage.create_bucket(bucket_name)
                logger.info(f"Created bucket: {bucket_name}")
        except Exception as e:
            logger.warning(f"Could not ensure bucket exists: {str(e)}")
    
    def upload_image(
        self,
        bucket_name: str,
        file_path: str,
        image_data: Union[bytes, BinaryIO],
        max_width: int = 1920,
        max_height: int = 1080,
        quality: int = 85
    ) -> str:
        """
        Upload and optimize an image to Supabase Storage
        """
        try:
            # Open and process image
            if isinstance(image_data, bytes):
                image = Image.open(BytesIO(image_data))
            else:
                image = Image.open(image_data)
            
            # Resize if needed
            if image.width > max_width or image.height > max_height:
                image.thumbnail((max_width, max_height), Image.Resampling.LANCZOS)
            
            # Convert to RGB if necessary
            if image.mode in ('RGBA', 'LA', 'P'):
                background = Image.new('RGB', image.size, (255, 255, 255))
                if image.mode == 'P':
                    image = image.convert('RGBA')
                background.paste(image, mask=image.split()[-1] if image.mode == 'RGBA' else None)
                image = background
            
            # Save optimized image
            output = BytesIO()
            image.save(output, format='JPEG', quality=quality, optimize=True)
            output.seek(0)
            
            # Upload optimized image
            return self.upload_file(
                bucket_name,
                file_path,
                output.getvalue(),
                content_type='image/jpeg',
                public=True
            )
            
        except Exception as e:
            logger.error(f"Failed to upload image: {str(e)}")
            raise ValidationException(f"Failed to upload image: {str(e)}")
    
    def list_files(self, bucket_name: str, folder_path: str = "") -> list:
        """
        List files in a bucket folder
        """
        try:
            files = self.client.storage.from_(bucket_name).list(folder_path)
            return files
        except Exception as e:
            logger.error(f"Failed to list files: {str(e)}")
            return []
    
    def get_file_info(self, bucket_name: str, file_path: str) -> dict:
        """
        Get file information
        """
        try:
            files = self.client.storage.from_(bucket_name).list(os.path.dirname(file_path))
            file_name = os.path.basename(file_path)
            
            for file in files:
                if file['name'] == file_name:
                    return file
            
            return {}
        except Exception as e:
            logger.error(f"Failed to get file info: {str(e)}")
            return {}
