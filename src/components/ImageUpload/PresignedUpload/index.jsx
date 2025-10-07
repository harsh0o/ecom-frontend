import { useState } from "react";
import { Upload, Check } from "lucide-react";
const apiEndpoint = import.meta.env.VITE_API_BASE_URL;

const PresignedUpload = ({ onUploadSuccess }) => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateTitle = (value) => {
    if (!value.trim()) return "Title is required";
    if (!/^[a-zA-Z\s]+$/.test(value))
      return "Only alphabetic characters allowed";
    if (value.length > 100) return "Maximum 100 characters allowed";
    return null;
  };

  const validateImage = (file) => {
    if (!file.type.startsWith("image/")) return "Only image files allowed";
    if (file.size > 1024 * 1024) return "Image must be less than 1MB";
    return null;
  };

  const handleTitleChange = (e) => {
    const value = e.target.value;
    setTitle(value);
    const error = validateTitle(value);
    setErrors((prev) => ({ ...prev, title: error }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const error = validateImage(file);
    if (error) {
      setErrors((prev) => ({ ...prev, image: error }));
      setImage(null);
    } else {
      setImage(file);
      setErrors((prev) => ({ ...prev, image: null }));
    }
  };

  const handleSubmit = async () => {
    setSuccess(false);

    const titleError = validateTitle(title);
    if (titleError || !image) {
      setErrors({
        title: titleError,
        image: !image ? "Image is required" : null,
      });
      return;
    }

    setUploading(true);

    try {
      const presignedResponse = await fetch(`${apiEndpoint}/presigned-url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: image.name,
          fileType: image.type,
        }),
      });

      if (!presignedResponse.ok) throw new Error("Failed to get presigned URL");

      const { presignedUrl, imageUrl } = await presignedResponse.json();

      const uploadResponse = await fetch(presignedUrl, {
        method: "PUT",
        body: image,
        headers: {
          "Content-Type": image.type,
        },
      });

      if (!uploadResponse.ok) throw new Error("Failed to upload to S3");

      const saveResponse = await fetch(`${apiEndpoint}/save-image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, imageUrl }),
      });

      if (!saveResponse.ok) throw new Error("Failed to save image metadata");

      setSuccess(true);
      setTitle("");
      setImage(null);
      setErrors({});
      if (onUploadSuccess) onUploadSuccess();

      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <h3 className="text-xl font-semibold text-orange-500 mb-4">
        Presigned URL Upload
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Title <span className="text-orange-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
            placeholder="Enter image title (alphabets only, max 100 chars)"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Image <span className="text-orange-500">*</span>
          </label>
          <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-orange-500 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="presigned-upload"
            />
            <label htmlFor="presigned-upload" className="cursor-pointer block">
              <Upload className="mx-auto h-12 w-12 text-gray-500 mb-2" />
              <p className="text-gray-400">Click to upload single image</p>
              <p className="text-xs text-gray-500 mt-1">Max 1MB</p>
            </label>
          </div>
          {image && <p className="text-sm text-gray-400 mt-2">{image.name}</p>}
          {errors.image && (
            <p className="text-red-500 text-sm mt-1">{errors.image}</p>
          )}
        </div>

        {errors.submit && (
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-3 text-red-400">
            {errors.submit}
          </div>
        )}

        {success && (
          <div className="bg-green-900/20 border border-green-500 rounded-lg p-3 text-green-400 flex items-center">
            <Check className="mr-2" size={20} />
            Upload successful!
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={uploading}
          className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          {uploading ? "Uploading..." : "Upload Image"}
        </button>
      </div>
    </div>
  );
};

export default PresignedUpload
