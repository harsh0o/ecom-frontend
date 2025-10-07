import { useState, useEffect } from "react";
import { Edit2, Trash2, Check, XCircle, User2 } from "lucide-react";
import MulterUpload from "./MulterUpload";
import PresignedUpload from "./PresignedUpload";
import { useNavigate } from "react-router-dom";
const apiEndpoint = import.meta.env.VITE_API_BASE_URL;

export default function ImageManager() {
  const [activeTab, setActiveTab] = useState("multer");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const navigate = useNavigate();

  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiEndpoint}/images`);
      const data = await response.json();
      setImages(data.data);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    try {
      const response = await fetch(`${apiEndpoint}/images/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchImages();
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleUpdate = async (id) => {
    if (!/^[a-zA-Z\s]+$/.test(editTitle) || editTitle.length > 100) {
      alert("Invalid title");
      return;
    }

    try {
      const response = await fetch(`${apiEndpoint}/images/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle }),
      });

      if (response.ok) {
        setEditingId(null);
        setEditTitle("");
        fetchImages();
      }
    } catch (error) {
      console.error("Error updating image:", error);
    }
  };

  const startEdit = (id, currentTitle) => {
    setEditingId(id);
    setEditTitle(currentTitle);
  };

  const rediredtToUser = () => {
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-orange-500 mb-8">
          Image Upload Manager
        </h1>
        <button
          onClick={rediredtToUser}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors font-semibold"
        >
          <User2 size={20} />
          User list
        </button>
        <div className="flex space-x-4 mb-6 border-b border-gray-800">
          <button
            onClick={() => setActiveTab("multer")}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === "multer"
                ? "text-orange-500 border-b-2 border-orange-500"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Multer Upload
          </button>
          <button
            onClick={() => setActiveTab("presigned")}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === "presigned"
                ? "text-orange-500 border-b-2 border-orange-500"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Presigned URL Upload
          </button>
        </div>

        <div className="mb-8">
          {activeTab === "multer" ? (
            <MulterUpload onUploadSuccess={fetchImages} />
          ) : (
            <PresignedUpload onUploadSuccess={fetchImages} />
          )}
        </div>

        <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="text-2xl font-semibold text-orange-500">
              Uploaded Images
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : images.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              No images uploaded yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                      Image
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {images.map((img) => (
                    <tr key={img.id} className="hover:bg-gray-800/50">
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {img.id}
                      </td>
                      <td className="px-6 py-4">
                        {editingId === img.id ? (
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-white text-sm"
                          />
                        ) : (
                          <span className="text-sm text-gray-300">
                            {img.title}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <img
                          src={img.image_url}
                          alt={img.title}
                          className="h-16 w-16 object-cover rounded border border-gray-700"
                        />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {new Date(img.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          {editingId === img.id ? (
                            <>
                              <button
                                onClick={() => handleUpdate(img.id)}
                                className="p-2 bg-green-600 hover:bg-green-700 rounded transition-colors"
                              >
                                <Check size={16} />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingId(null);
                                  setEditTitle("");
                                }}
                                className="p-2 bg-gray-600 hover:bg-gray-700 rounded transition-colors"
                              >
                                <XCircle size={16} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => startEdit(img.id, img.title)}
                                className="p-2 bg-orange-600 hover:bg-orange-700 rounded transition-colors"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(img.id)}
                                className="p-2 bg-red-600 hover:bg-red-700 rounded transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
