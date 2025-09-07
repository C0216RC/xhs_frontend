// src/components/common/Header.js
import React from 'react';
import { Search, Bell, MessageCircle, Plus } from 'lucide-react';

const Header = ({ onSearch, searchQuery }) => {
  const handleSearchChange = (e) => {
    onSearch(e.target.value);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">小</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 hidden sm:block">小红书</h1>
          </div>

          {/* 搜索框 */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="搜索笔记、用户"
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all duration-200 text-sm"
              />
            </div>
          </div>

          {/* 右侧功能按钮 */}
          <div className="flex items-center gap-1">
            {/* 发布按钮 */}
            <button className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full hover:from-red-600 hover:to-pink-600 transition-all duration-200 font-medium text-sm flex items-center gap-1">
              <Plus size={16} />
              <span className="hidden sm:inline">发布</span>
            </button>
            
            {/* 通知按钮 */}
            <button className="p-2.5 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200">
              <Bell size={20} />
            </button>
            
            {/* 消息按钮 */}
            <button className="p-2.5 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200">
              <MessageCircle size={20} />
            </button>
            
            {/* 用户头像 */}
            <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center cursor-pointer ml-2 hover:shadow-lg transition-all duration-200">
              <span className="text-white text-sm font-medium">我</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;