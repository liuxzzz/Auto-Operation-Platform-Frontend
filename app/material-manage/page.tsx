"use client";

import { FileText, Image, Search, Trash2, Upload, Video } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

// 模拟素材数据
const DEMO_MATERIALS = [
  {
    id: "material-1",
    name: "秋日穿搭-1.jpg",
    type: "image",
    size: "2.3 MB",
    uploadTime: "2024-01-15",
    url: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=600&fit=crop",
    tags: ["穿搭", "秋装", "时尚"],
    usedCount: 5,
  },
  {
    id: "material-2",
    name: "居家穿搭视频.mp4",
    type: "video",
    size: "15.7 MB",
    uploadTime: "2024-01-14",
    url: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=300&fit=crop",
    tags: ["居家", "舒适", "视频"],
    usedCount: 3,
  },
  {
    id: "material-3",
    name: "卫衣搭配图.jpg",
    type: "image",
    size: "1.8 MB",
    uploadTime: "2024-01-13",
    url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=600&fit=crop",
    tags: ["卫衣", "运动", "搭配"],
    usedCount: 8,
  },
  {
    id: "material-4",
    name: "文案模板.txt",
    type: "text",
    size: "2.1 KB",
    uploadTime: "2024-01-12",
    url: "",
    tags: ["文案", "模板", "写作"],
    usedCount: 12,
  },
];

const MATERIAL_TYPES = [
  { value: "all", label: "全部", icon: FileText },
  { value: "image", label: "图片", icon: Image },
  { value: "video", label: "视频", icon: Video },
  { value: "text", label: "文本", icon: FileText },
];

export default function MaterialManage() {
  const [materials, setMaterials] = useState(DEMO_MATERIALS);
  const [selectedType, setSelectedType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);

  // 筛选素材
  const filteredMaterials = materials.filter(material => {
    const matchesType =
      selectedType === "all" || material.type === selectedType;
    const matchesSearch =
      material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.tags.some(tag =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchesType && matchesSearch;
  });

  // 获取文件图标
  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return Image;
      case "video":
        return Video;
      case "text":
        return FileText;
      default:
        return FileText;
    }
  };

  // 获取文件类型颜色
  const getTypeColor = (type: string) => {
    switch (type) {
      case "image":
        return "text-green-600 bg-green-50";
      case "video":
        return "text-blue-600 bg-blue-50";
      case "text":
        return "text-purple-600 bg-purple-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  // 处理素材选择
  const handleSelectMaterial = (materialId: string) => {
    setSelectedMaterials(prev =>
      prev.includes(materialId)
        ? prev.filter(id => id !== materialId)
        : [...prev, materialId]
    );
  };

  // 批量删除
  const handleBatchDelete = () => {
    if (selectedMaterials.length === 0) return;

    if (confirm(`确定要删除选中的 ${selectedMaterials.length} 个素材吗？`)) {
      setMaterials(prev =>
        prev.filter(material => !selectedMaterials.includes(material.id))
      );
      setSelectedMaterials([]);
    }
  };

  // 删除单个素材
  const handleDeleteMaterial = (materialId: string) => {
    if (confirm("确定要删除这个素材吗？")) {
      setMaterials(prev => prev.filter(material => material.id !== materialId));
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* 头部 */}
      <div className="bg-white shadow-sm flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">素材管理</h1>
              <p className="text-gray-600 mt-1">管理您的图片、视频和文本素材</p>
            </div>
            <Button className="flex items-center space-x-2">
              <Upload size={16} />
              <span>上传素材</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 工具栏 */}
      <div className="bg-white border-b flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* 类型筛选 */}
              <div className="flex items-center space-x-2">
                {MATERIAL_TYPES.map(type => {
                  const IconComponent = type.icon;
                  return (
                    <button
                      key={type.value}
                      onClick={() => setSelectedType(type.value)}
                      className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedType === type.value
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <IconComponent size={14} />
                      <span>{type.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* 搜索框 */}
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="搜索素材..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            {/* 批量操作 */}
            {selectedMaterials.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  已选择 {selectedMaterials.length} 个素材
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBatchDelete}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                >
                  <Trash2 size={14} />
                  <span>批量删除</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-y-auto">{"//TODO: 素材管理"}</div>
    </div>
  );
}
