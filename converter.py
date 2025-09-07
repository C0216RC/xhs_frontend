# # batch_pkl_to_json_converter.py
# # 批量PKL文件转JSON转换脚本 - 支持多文件夹和分批处理
# # 使用方法: python batch_pkl_to_json_converter.py

# import pickle
# import json
# import os
# import glob
# import argparse
# from datetime import datetime
# import sys
# from pathlib import Path

# class BatchPKLToJSONConverter:
#     def __init__(self, base_data_path, base_output_path):
#         """
#         初始化批量转换器
        
#         Args:
#             base_data_path: 数据根目录路径（包含各个PKL文件和文件夹的根目录）
#             base_output_path: 输出根目录路径
#         """
#         self.base_data_path = Path(base_data_path)
#         self.base_output_path = Path(base_output_path)
#         self.ensure_base_output_directory()
        
#         # 数据源配置
#         self.data_sources = {
#             'Part1': {
#                 'pkl_file': 'Part1.pkl',
#                 'image_folder': 'Part1',
#                 'output_folder': 'part1_data'
#             },
#             'Part2': {
#                 'pkl_file': 'Part2.pkl', 
#                 'image_folder': 'Part2',
#                 'output_folder': 'part2_data'
#             },
#             'PartNormal': {
#                 'pkl_file': 'PartNormal.pkl',
#                 'image_folder': 'PartNormal', 
#                 'output_folder': 'partnormal_data'
#             }
#         }
        
#         # LLM响应目录
#         self.llm_response_folder = 'LLMResponse'
    
#     def ensure_base_output_directory(self):
#         """确保基础输出目录存在"""
#         self.base_output_path.mkdir(parents=True, exist_ok=True)
#         print(f"基础输出目录: {self.base_output_path}")
    
#     def load_pkl_file(self, file_path):
#         """安全加载PKL文件"""
#         try:
#             with open(file_path, 'rb') as f:
#                 data = pickle.load(f)
#                 print(f"✓ 成功加载: {file_path.name} ({self.format_file_size(file_path)})")
#                 return data
#         except Exception as e:
#             print(f"✗ 加载失败 {file_path}: {e}")
#             return None
    
#     def save_json_file(self, data, file_path):
#         """保存JSON文件"""
#         try:
#             file_path.parent.mkdir(parents=True, exist_ok=True)
#             with open(file_path, 'w', encoding='utf-8') as f:
#                 json.dump(data, f, ensure_ascii=False, indent=2)
#             print(f"✓ 已保存: {file_path} ({self.format_file_size(file_path)})")
#             return True
#         except Exception as e:
#             print(f"✗ 保存失败 {file_path}: {e}")
#             return False
    
#     def format_file_size(self, file_path):
#         """格式化文件大小显示"""
#         try:
#             size = file_path.stat().st_size
#             for unit in ['B', 'KB', 'MB', 'GB']:
#                 if size < 1024:
#                     return f"{size:.1f} {unit}"
#                 size /= 1024
#             return f"{size:.1f} TB"
#         except:
#             return "未知大小"
    
#     def safe_int(self, value):
#         """安全地转换为整数"""
#         try:
#             if isinstance(value, str):
#                 cleaned = ''.join(c for c in value if c.isdigit() or c == '-')
#                 return int(cleaned) if cleaned and cleaned != '-' else 0
#             return int(value) if value is not None else 0
#         except (ValueError, TypeError):
#             return 0
    
#     def convert_single_post(self, post_data):
#         """转换单个帖子数据"""
#         try:
#             # 处理评论数据
#             comments = []
#             if 'all_comments' in post_data and post_data['all_comments']:
#                 for comment in post_data['all_comments']:
#                     comments.append({
#                         'comment_id': comment.get('comment_id', ''),
#                         'content': comment.get('content', ''),
#                         'user_id': comment.get('user_id', ''),
#                         'nickname': comment.get('nickname', ''),
#                         'avatar': comment.get('avatar', ''),
#                         'like_count': self.safe_int(comment.get('like_count', 0)),
#                         'sub_comment_count': self.safe_int(comment.get('sub_comment_count', 0)),
#                         'create_time': self.safe_int(comment.get('create_time', 0)),
#                         'parent_comment_id': comment.get('parent_comment_id', '0')
#                     })
            
#             # 转换后的帖子数据
#             converted = {
#                 'note_id': post_data.get('note_id', ''),
#                 'type': post_data.get('type', 'image'),
#                 'title': post_data.get('title', ''),
#                 'desc': post_data.get('desc', ''),
#                 'video_url': post_data.get('video_url', ''),
#                 'time': self.safe_int(post_data.get('time', 0)),
#                 'user_id': post_data.get('user_id', ''),
#                 'nickname': post_data.get('nickname', ''),
#                 'avatar': post_data.get('avatar', ''),
#                 'liked_count': self.safe_int(post_data.get('liked_count', 0)),
#                 'collected_count': self.safe_int(post_data.get('collected_count', 0)),
#                 'comment_count': self.safe_int(post_data.get('comment_count', 0)),
#                 'share_count': self.safe_int(post_data.get('share_count', 0)),
#                 'image_list': post_data.get('image_list', ''),
#                 'tag_list': post_data.get('tag_list', ''),
#                 'source_keyword': post_data.get('source_keyword', ''),
#                 'all_comments': comments,
#                 'image_folder_path': post_data.get('image_folder_path', ''),
#                 'ip_location': post_data.get('ip_location', ''),
#                 'note_url': post_data.get('note_url', ''),
#                 'xsec_token': post_data.get('xsec_token', ''),
#                 'last_modify_ts': post_data.get('last_modify_ts', 0),
#                 'last_update_time': post_data.get('last_update_time', 0)
#             }
            
#             return converted
            
#         except Exception as e:
#             print(f"✗ 转换帖子数据失败: {e}")
#             return None
    
#     def convert_llm_responses_for_partition(self, partition_name, note_ids):
#         """为特定分区转换LLM响应数据"""
#         print(f"\n--- 为 {partition_name} 处理LLM响应 ---")
        
#         llm_response_dir = self.base_data_path / self.llm_response_folder
#         if not llm_response_dir.exists():
#             print(f"✗ LLMResponse目录不存在: {llm_response_dir}")
#             return {}
        
#         llm_responses = {}
#         response_types = ['overall', 'text', 'image']
        
#         processed_count = 0
#         for note_id in note_ids:
#             note_responses = {}
            
#             for response_type in response_types:
#                 response_file = llm_response_dir / f"{note_id}{response_type}.pkl"
                
#                 if response_file.exists():
#                     response_data = self.load_pkl_file(response_file)
#                     if response_data is not None:
#                         note_responses[response_type] = response_data
#                 else:
#                     print(f"  ⚠ 未找到: {response_file.name}")
            
#             if note_responses:
#                 llm_responses[note_id] = note_responses
#                 processed_count += 1
                
#                 # 每处理100个显示一次进度
#                 if processed_count % 100 == 0:
#                     print(f"  已处理LLM响应: {processed_count}/{len(note_ids)}")
        
#         print(f"✓ {partition_name} LLM响应处理完成: {processed_count}/{len(note_ids)}")
#         return llm_responses
    
#     def convert_partition_data(self, partition_name, config):
#         """转换单个分区数据"""
#         print(f"\n{'='*60}")
#         print(f"开始处理: {partition_name}")
#         print(f"{'='*60}")
        
#         # 创建分区专用输出目录
#         partition_output_dir = self.base_output_path / config['output_folder']
#         partition_output_dir.mkdir(parents=True, exist_ok=True)
        
#         # 检查PKL文件是否存在
#         pkl_file_path = self.base_data_path / config['pkl_file']
#         if not pkl_file_path.exists():
#             print(f"✗ PKL文件不存在: {pkl_file_path}")
#             return [], {}
        
#         print(f"数据源: {pkl_file_path}")
#         print(f"输出目录: {partition_output_dir}")
        
#         # 加载分区数据
#         posts_data = self.load_pkl_file(pkl_file_path)
#         if posts_data is None:
#             return [], {}
        
#         print(f"找到 {len(posts_data)} 个帖子")
        
#         # 转换所有帖子
#         converted_posts = []
#         note_ids = []
        
#         for i, post in enumerate(posts_data):
#             converted_post = self.convert_single_post(post)
#             if converted_post:
#                 converted_posts.append(converted_post)
#                 note_ids.append(converted_post['note_id'])
            
#             # 显示进度
#             if (i + 1) % 100 == 0 or (i + 1) == len(posts_data):
#                 print(f"帖子转换进度: {i + 1}/{len(posts_data)}")
        
#         # 保存帖子数据
#         posts_json_path = partition_output_dir / f"{partition_name.lower()}_posts.json"
#         self.save_json_file(converted_posts, posts_json_path)
        
#         # 转换对应的LLM响应
#         llm_responses = self.convert_llm_responses_for_partition(partition_name, note_ids)
        
#         # 保存LLM响应数据
#         if llm_responses:
#             llm_json_path = partition_output_dir / f"{partition_name.lower()}_llm_responses.json"
#             self.save_json_file(llm_responses, llm_json_path)
        
#         # 创建分区配置文件
#         partition_config = {
#             "partition_name": partition_name,
#             "posts_count": len(converted_posts),
#             "llm_responses_count": len(llm_responses),
#             "created_at": datetime.now().isoformat(),
#             "source_pkl": str(pkl_file_path),
#             "image_folder": config.get('image_folder', ''),
#             "files": {
#                 "posts": f"{partition_name.lower()}_posts.json",
#                 "llm_responses": f"{partition_name.lower()}_llm_responses.json"
#             }
#         }
        
#         config_path = partition_output_dir / "config.json"
#         self.save_json_file(partition_config, config_path)
        
#         print(f"\n✓ {partition_name} 处理完成!")
#         print(f"  - 帖子数据: {len(converted_posts)} 条")
#         print(f"  - LLM响应: {len(llm_responses)} 条")
#         print(f"  - 输出目录: {partition_output_dir}")
        
#         return converted_posts, llm_responses
    
#     def convert_all_partitions(self):
#         """转换所有分区数据"""
#         print("开始批量转换PKL文件到JSON格式...")
#         print(f"数据根目录: {self.base_data_path}")
#         print(f"输出根目录: {self.base_output_path}")
        
#         all_posts = []
#         all_llm_responses = {}
#         partition_summary = {}
        
#         # 处理每个分区
#         for partition_name, config in self.data_sources.items():
#             posts, llm_responses = self.convert_partition_data(partition_name, config)
            
#             # 合并到总数据中
#             all_posts.extend(posts)
#             all_llm_responses.update(llm_responses)
            
#             # 记录分区汇总信息
#             partition_summary[partition_name] = {
#                 "posts_count": len(posts),
#                 "llm_responses_count": len(llm_responses),
#                 "output_folder": config['output_folder']
#             }
        
#         # 保存合并的所有数据
#         if all_posts:
#             print(f"\n{'='*60}")
#             print("保存合并数据")
#             print(f"{'='*60}")
            
#             # 保存所有帖子数据
#             all_posts_path = self.base_output_path / 'all_posts.json'
#             self.save_json_file(all_posts, all_posts_path)
            
#             # 保存所有LLM响应数据
#             all_llm_path = self.base_output_path / 'all_llm_responses.json'
#             self.save_json_file(all_llm_responses, all_llm_path)
            
#             # 创建总配置文件
#             master_config = {
#                 "total_posts": len(all_posts),
#                 "total_llm_responses": len(all_llm_responses),
#                 "partitions": partition_summary,
#                 "created_at": datetime.now().isoformat(),
#                 "source_directory": str(self.base_data_path),
#                 "files": {
#                     "all_posts": "all_posts.json",
#                     "all_llm_responses": "all_llm_responses.json"
#                 }
#             }
            
#             master_config_path = self.base_output_path / 'master_config.json'
#             self.save_json_file(master_config, master_config_path)
            
#             # 创建前端兼容的配置文件
#             frontend_config = {
#                 "dataPath": "/data",
#                 "lastUpdated": datetime.now().isoformat(),
#                 "totalPosts": len(all_posts),
#                 "totalLLMResponses": len(all_llm_responses),
#                 "availableFiles": [
#                     {
#                         "name": "all_posts.json",
#                         "size": all_posts_path.stat().st_size,
#                         "path": "/data/all_posts.json",
#                         "type": "posts"
#                     },
#                     {
#                         "name": "all_llm_responses.json", 
#                         "size": all_llm_path.stat().st_size,
#                         "path": "/data/all_llm_responses.json",
#                         "type": "llm_responses"
#                     }
#                 ]
#             }
            
#             frontend_config_path = self.base_output_path / 'config.json'
#             self.save_json_file(frontend_config, frontend_config_path)
        
#         # 打印最终汇总
#         print(f"\n{'='*60}")
#         print("转换完成汇总")
#         print(f"{'='*60}")
#         print(f"总帖子数: {len(all_posts)}")
#         print(f"总LLM响应数: {len(all_llm_responses)}")
#         print(f"处理的分区:")
#         for partition_name, summary in partition_summary.items():
#             print(f"  - {partition_name}: {summary['posts_count']} 帖子, {summary['llm_responses_count']} LLM响应")
#         print(f"\n所有文件已保存到: {self.base_output_path}")
        
#         return all_posts, all_llm_responses, partition_summary
    
#     def create_copy_instructions(self):
#         """创建文件复制说明"""
#         instructions = f"""
# # 文件复制说明

# ## 转换完成的文件结构:
# {self.base_output_path}/
# ├── all_posts.json              # 所有帖子合并数据 (前端主要使用)
# ├── all_llm_responses.json      # 所有LLM响应合并数据 (前端主要使用)  
# ├── config.json                 # 前端配置文件
# ├── master_config.json          # 主配置文件
# ├── part1_data/                 # Part1分区数据
# │   ├── part1_posts.json
# │   ├── part1_llm_responses.json
# │   └── config.json
# ├── part2_data/                 # Part2分区数据
# │   ├── part2_posts.json
# │   ├── part2_llm_responses.json  
# │   └── config.json
# └── partnormal_data/            # PartNormal分区数据
#     ├── partnormal_posts.json
#     ├── partnormal_llm_responses.json
#     └── config.json

# ## 复制到前端项目:

# 1. 创建前端数据目录:
#    mkdir 你的前端项目/public/data

# 2. 复制主要文件(推荐):
#    copy "{self.base_output_path}/all_posts.json" "你的前端项目/public/data/"
#    copy "{self.base_output_path}/all_llm_responses.json" "你的前端项目/public/data/"
#    copy "{self.base_output_path}/config.json" "你的前端项目/public/data/"

# 3. 或者复制所有文件:
#    xcopy "{self.base_output_path}" "你的前端项目/public/data/" /E /I

# ## 前端加载说明:
# - 前端会优先加载 all_posts.json 和 all_llm_responses.json
# - 如果需要分区加载，可以修改前端代码使用各分区的单独文件
# - config.json 包含了文件元信息，帮助前端了解数据结构
# """
        
#         instructions_path = self.base_output_path / 'COPY_INSTRUCTIONS.txt'
#         with open(instructions_path, 'w', encoding='utf-8') as f:
#             f.write(instructions)
        
#         print(f"✓ 已创建复制说明文件: {instructions_path}")

# def main():
#     """主函数 - 命令行参数版本"""
#     parser = argparse.ArgumentParser(description='批量PKL文件转JSON转换工具')
#     parser.add_argument('--input', '-i', required=True, help='PKL文件根目录路径 (包含Part1.pkl, Part2.pkl等)')
#     parser.add_argument('--output', '-o', required=True, help='JSON文件输出根目录路径')
    
#     args = parser.parse_args()
    
#     # 验证输入路径
#     input_path = Path(args.input)
#     if not input_path.exists():
#         print(f"✗ 输入路径不存在: {input_path}")
#         sys.exit(1)
    
#     # 创建转换器并执行转换
#     converter = BatchPKLToJSONConverter(input_path, args.output)
#     converter.convert_all_partitions()
#     converter.create_copy_instructions()
    
#     print(f"\n✓ 批量转换完成！")
#     print(f"请查看 {converter.base_output_path}/COPY_INSTRUCTIONS.txt 了解如何复制文件到前端项目")

# def interactive_main():
#     """交互式主函数"""
#     print("批量PKL文件转JSON转换工具")
#     print("=" * 60)
#     print("此工具会处理以下文件:")
#     print("- Part1.pkl -> part1_data/")
#     print("- Part2.pkl -> part2_data/") 
#     print("- PartNormal.pkl -> partnormal_data/")
#     print("- LLMResponse/ -> 对应分区的LLM响应文件")
#     print("=" * 60)
    
#     # # 获取输入路径
#     # while True:
#     #     input_path = input("\n请输入PKL文件根目录路径 (包含Part1.pkl, Part2.pkl等): ").strip().strip('"')
#     #     if not input_path:
#     #         print("输入路径不能为空")
#     #         continue
            
#     #     input_path = Path(input_path)
#     #     if not input_path.exists():
#     #         print(f"✗ 路径不存在: {input_path}")
#     #         continue
        
#     #     # 检查必要文件
#     #     missing_files = []
#     #     required_files = ['Part1.pkl', 'Part2.pkl', 'PartNormal.pkl']
#     #     for file in required_files:
#     #         if not (input_path / file).exists():
#     #             missing_files.append(file)
        
#     #     if missing_files:
#     #         print(f"⚠ 以下文件不存在: {', '.join(missing_files)}")
#     #         choice = input("是否继续处理存在的文件? (y/N): ").lower()
#     #         if choice != 'y':
#     #             continue
        
#     #     break
    
#     # # 获取输出路径
#     # while True:
#     #     output_path = input("请输入JSON文件输出根目录路径: ").strip().strip('"')
#     #     if not output_path:
#     #         print("输出路径不能为空")
#     #         continue
#     #     break
    
#     # print(f"\n开始转换...")
#     # print(f"输入目录: {input_path}")
#     # print(f"输出目录: {output_path}")
    
#     # # 创建转换器并执行转换
#     # converter = BatchPKLToJSONConverter(input_path, output_path)
#     # converter.convert_all_partitions()
#     # converter.create_copy_instructions()
    
#     # print(f"\n✓ 批量转换完成！")
#     # print(f"请查看 {converter.base_output_path}/COPY_INSTRUCTIONS.txt 了解如何复制文件到前端项目")

# if __name__ == "__main__":
    
#     input_path = "/Users/roychen/Desktop/xhs/Rednote"  # 修改为你的PKL文件目录
#     output_path = "/Users/roychen/Desktop/xhs/xiaohongshu/frontend/public/data"  # 修改为你的JSON输出目录
    
#     print("批量PKL文件转JSON转换工具")
#     print("=" * 60)
#     print(f"输入目录: {input_path}")
#     print(f"输出目录: {output_path}")
#     print("=" * 60)
    
#     # 验证输入路径
#     input_path_obj = Path(input_path)
#     if not input_path_obj.exists():
#         print(f"✗ 输入路径不存在: {input_path}")
#         sys.exit(1)
    
#     # 创建转换器并执行转换
#     converter = BatchPKLToJSONConverter(input_path, output_path)
#     converter.convert_all_partitions()
#     converter.create_copy_instructions()
    
#     print(f"\n✓ 批量转换完成！")
#     print(f"请查看 {converter.base_output_path}/COPY_INSTRUCTIONS.txt 了解如何复制文件到前端项目")
#     # 如果没有命令行参数，提供交互式输入
#     if len(sys.argv) == 1:
#         interactive_main()
#     else:
#         main()









# llm_response_converter.py
# 专用于LLM响应PKL文件转JSON转换脚本 - 每个PKL文件转换为单独的JSON文件
# 使用方法: python llm_response_converter.py

import pickle
import json
import os
import glob
import argparse
from datetime import datetime
import sys
from pathlib import Path
import traceback

class LLMResponseConverter:
    def __init__(self, llm_response_path, output_dir):
        """
        初始化LLM响应转换器
        
        Args:
            llm_response_path: LLMResponse文件夹路径
            output_dir: 输出JSON文件夹路径
        """
        self.llm_response_path = Path(llm_response_path)
        self.output_dir = Path(output_dir)
        
        # 确保输出目录存在
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
        print(f"LLM响应目录: {self.llm_response_path}")
        print(f"输出目录: {self.output_dir}")
    
    def load_pkl_file_safely(self, file_path):
        """安全加载PKL文件，支持多种编码和错误处理"""
        print(f"  正在加载: {file_path.name}")
        
        loading_strategies = [
            # 策略1: 标准加载
            {'method': 'standard', 'kwargs': {}},
            # 策略2: 指定编码
            {'method': 'encoding', 'kwargs': {'encoding': 'bytes'}},
            {'method': 'encoding', 'kwargs': {'encoding': 'latin-1'}},
            {'method': 'encoding', 'kwargs': {'encoding': 'utf-8'}},
            # 策略3: 修复损坏的pickle
            {'method': 'fix_imports', 'kwargs': {'fix_imports': True}},
        ]
        
        for i, strategy in enumerate(loading_strategies):
            try:
                with open(file_path, 'rb') as f:
                    if strategy['method'] == 'standard':
                        data = pickle.load(f)
                    else:
                        data = pickle.load(f, **strategy['kwargs'])
                    
                    print(f"    ✓ 策略{i+1}成功: {strategy['method']}")
                    
                    # 验证数据不为空
                    if data is not None:
                        # 检查数据结构
                        data_info = self.analyze_data_structure(data)
                        print(f"    数据结构: {data_info}")
                        return data, None
                    else:
                        print(f"    ⚠ 数据为空")
                        continue
                        
            except Exception as e:
                print(f"    ✗ 策略{i+1}失败: {str(e)[:100]}")
                continue
        
        return None, f"所有加载策略都失败"
    
    def analyze_data_structure(self, data):
        """分析数据结构"""
        if isinstance(data, dict):
            return f"dict with {len(data)} keys"
        elif isinstance(data, list):
            if len(data) > 0:
                first_item_type = type(data[0]).__name__
                return f"list with {len(data)} items (first: {first_item_type})"
            else:
                return "empty list"
        elif isinstance(data, str):
            return f"string with {len(data)} characters"
        elif isinstance(data, bytes):
            return f"bytes with {len(data)} length"
        else:
            return f"{type(data).__name__}"
    
    def process_data_recursively(self, data, depth=0, max_depth=50):
        """递归处理数据，确保所有内容都被正确转换，防止无限递归"""
        # 防止无限递归
        if depth > max_depth:
            return f"<递归深度超限: {type(data).__name__}>"
        
        if isinstance(data, dict):
            result = {}
            for key, value in data.items():
                # 确保key是字符串
                try:
                    str_key = str(key) if not isinstance(key, str) else key
                    # 处理特殊字符的key
                    str_key = self.clean_string(str_key)
                    result[str_key] = self.process_data_recursively(value, depth + 1, max_depth)
                except Exception as e:
                    result[f"<错误的key_{depth}>"] = f"<key处理错误: {e}>"
            return result
            
        elif isinstance(data, list):
            try:
                return [self.process_data_recursively(item, depth + 1, max_depth) for item in data]
            except Exception as e:
                return f"<列表处理错误: {e}>"
            
        elif isinstance(data, tuple):
            try:
                return [self.process_data_recursively(item, depth + 1, max_depth) for item in data]
            except Exception as e:
                return f"<元组处理错误: {e}>"
            
        elif isinstance(data, bytes):
            return self.decode_bytes_safely(data)
                    
        elif isinstance(data, str):
            return self.clean_string(data)
            
        elif isinstance(data, (int, float, bool)) or data is None:
            return data
            
        else:
            # 对于其他类型，尝试转换为字符串
            try:
                return self.clean_string(str(data))
            except Exception as e:
                return f"<无法转换的对象: {type(data).__name__}, 错误: {e}>"
    
    def decode_bytes_safely(self, data):
        """安全解码bytes数据"""
        encodings = ['utf-8', 'gbk', 'gb2312', 'big5', 'latin-1']
        
        for encoding in encodings:
            try:
                decoded = data.decode(encoding)
                return self.clean_string(decoded)
            except (UnicodeDecodeError, LookupError):
                continue
        
        # 如果所有编码都失败，使用错误处理
        try:
            return data.decode('utf-8', errors='replace')
        except Exception:
            return f"<无法解码的bytes: {len(data)} bytes>"
    
    def clean_string(self, text):
        """清理字符串，处理转义字符和特殊字符"""
        if not isinstance(text, str):
            text = str(text)
        
        try:
            # 保留原始的换行符，不要转换为\\n
            # 但是要处理其他转义字符
            
            # 先处理一些常见的转义序列
            replacements = {
                '\\t': '\t',
                '\\r': '\r',
                # 保留 \\n 为实际换行符
                # '\\n': '\n',  # 这个可能是问题所在
            }
            
            for old, new in replacements.items():
                text = text.replace(old, new)
            
            # 移除一些控制字符，但保留换行和制表符
            import re
            # 移除不可打印字符，但保留常用的空白字符
            text = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\x9f]', '', text)
            
            return text
            
        except Exception as e:
            print(f"字符串清理错误: {e}")
            return str(text)
    
    def get_all_llm_files(self):
        """获取所有LLM响应文件"""
        if not self.llm_response_path.exists():
            print(f"✗ LLMResponse目录不存在: {self.llm_response_path}")
            return []
        
        # 查找所有pkl文件
        pkl_files = list(self.llm_response_path.glob('*.pkl'))
        print(f"找到 {len(pkl_files)} 个PKL文件")
        
        return sorted(pkl_files)
    
    def convert_single_pkl_file(self, pkl_file):
        """转换单个PKL文件为JSON"""
        print(f"\n{'='*80}")
        print(f"处理文件: {pkl_file.name}")
        print(f"{'='*80}")
        
        # 生成对应的JSON文件路径
        json_filename = pkl_file.stem + '.json'  # 将.pkl替换为.json
        json_file_path = self.output_dir / json_filename
        
        # 加载PKL文件
        data, error = self.load_pkl_file_safely(pkl_file)
        
        if data is None:
            print(f"✗ 加载失败: {error}")
            return False, error
        
        # 在处理前检查原始数据
        original_info = self.get_detailed_data_info(data)
        print(f"原始数据: {original_info}")
        
        # 递归处理数据，确保完整性
        try:
            processed_data = self.process_data_recursively(data)
            
            # 检查处理后的数据
            processed_info = self.get_detailed_data_info(processed_data)
            print(f"处理后: {processed_info}")
            
        except Exception as e:
            error_msg = f"数据处理失败: {e}"
            print(f"✗ {error_msg}")
            return False, error_msg
        
        # 保存为JSON文件
        success, save_error = self.save_single_json_file(processed_data, json_file_path)
        
        if success:
            print(f"✓ 成功转换: {pkl_file.name} -> {json_filename}")
            return True, None
        else:
            print(f"✗ 保存失败: {save_error}")
            return False, save_error
    
    def save_single_json_file(self, data, json_file_path):
        """保存单个JSON文件并验证数据完整性"""
        try:
            print("开始JSON序列化...")
            
            # 使用更安全的JSON序列化参数
            json_str = json.dumps(
                data, 
                ensure_ascii=False,  # 允许非ASCII字符
                indent=2,
                separators=(',', ': '),
                sort_keys=False,
                default=str  # 对于无法序列化的对象，转换为字符串
            )
            
            print(f"JSON序列化完成，长度: {len(json_str)} 字符")
            
            # 保存到临时文件先测试
            temp_path = json_file_path.with_suffix('.tmp')
            
            print("保存到临时文件...")
            with open(temp_path, 'w', encoding='utf-8', newline='') as f:
                f.write(json_str)
            
            temp_size = temp_path.stat().st_size
            print(f"临时文件大小: {self.format_file_size(temp_size)}")
            
            # 验证临时文件能否正确读取
            print("验证临时文件...")
            with open(temp_path, 'r', encoding='utf-8') as f:
                loaded_data = json.load(f)
            
            # 进行详细验证
            validation_result = self.detailed_validation(data, loaded_data)
            
            # 如果验证通过，将临时文件重命名为最终文件
            if temp_path.exists():
                if json_file_path.exists():
                    json_file_path.unlink()  # 删除旧文件
                temp_path.rename(json_file_path)
                
                final_size = json_file_path.stat().st_size
                print(f"✓ JSON文件保存成功: {json_file_path.name}")
                print(f"✓ 文件大小: {self.format_file_size(final_size)}")
                
                return True, None
            
        except json.JSONEncodeError as e:
            error_msg = f"JSON编码错误: {e}"
            print(f"✗ {error_msg}")
            return False, error_msg
            
        except Exception as e:
            error_msg = f"保存JSON失败: {e}"
            print(f"✗ {error_msg}")
            traceback.print_exc()
            return False, error_msg
    
    def detailed_validation(self, original_data, loaded_data):
        """详细验证数据完整性"""
        print("进行详细数据验证...")
        
        if isinstance(original_data, dict) and isinstance(loaded_data, dict):
            # 检查键的完整性
            original_keys = set(original_data.keys())
            loaded_keys = set(loaded_data.keys())
            
            missing_keys = original_keys - loaded_keys
            extra_keys = loaded_keys - original_keys
            
            print(f"键验证: 原始{len(original_keys)}个, 加载{len(loaded_keys)}个")
            
            if missing_keys:
                print(f"⚠ 丢失的键: {list(missing_keys)[:5]}...")  # 只显示前5个
            
            if extra_keys:
                print(f"⚠ 额外的键: {list(extra_keys)[:5]}...")
            
            # 检查一些示例数据的完整性
            sample_keys = list(original_keys)[:3]  # 检查前3个键
            for key in sample_keys:
                if key in loaded_data:
                    orig_value = original_data[key]
                    loaded_value = loaded_data[key]
                    
                    if isinstance(orig_value, dict) and isinstance(loaded_value, dict):
                        orig_len = sum(len(str(v)) for v in orig_value.values() if isinstance(v, (str, list)))
                        loaded_len = sum(len(str(v)) for v in loaded_value.values() if isinstance(v, (str, list)))
                        print(f"键 '{key}' 内容长度: 原始{orig_len} vs 加载{loaded_len}")
                        
        elif isinstance(original_data, list) and isinstance(loaded_data, list):
            print(f"列表验证: 原始{len(original_data)}项, 加载{len(loaded_data)}项")
            
        elif isinstance(original_data, str) and isinstance(loaded_data, str):
            print(f"字符串验证: 原始{len(original_data)}字符, 加载{len(loaded_data)}字符")
            
        print("验证完成")
        return True
    
    def get_detailed_data_info(self, data):
        """获取详细的数据信息，用于调试"""
        try:
            if isinstance(data, list):
                if len(data) > 0:
                    # 检查列表中第一个元素
                    first_item = data[0]
                    if isinstance(first_item, str):
                        preview = first_item[:100] + "..." if len(first_item) > 100 else first_item
                        return f"list[{len(data)}], 首项: '{preview}'"
                    else:
                        return f"list[{len(data)}], 首项类型: {type(first_item).__name__}"
                else:
                    return "empty list"
            elif isinstance(data, str):
                preview = data[:100] + "..." if len(data) > 100 else data
                # 清理预览文本中的换行符以便显示
                preview = preview.replace('\n', '\\n').replace('\r', '\\r')
                return f"string[{len(data)}]: '{preview}'"
            elif isinstance(data, dict):
                keys_preview = list(data.keys())[:3]
                return f"dict[{len(data)}], 示例键: {keys_preview}"
            else:
                return f"{type(data).__name__}"
        except Exception as e:
            return f"获取信息失败: {e}"
    
    def convert_all_llm_responses(self):
        """转换所有LLM响应文件"""
        print("开始批量转换LLM响应文件...")
        
        # 获取所有pkl文件
        pkl_files = self.get_all_llm_files()
        if not pkl_files:
            print("✗ 没有找到PKL文件")
            return None
        
        # 转换统计
        total_files = len(pkl_files)
        successful_conversions = []
        failed_conversions = []
        
        # 逐个转换文件
        for i, pkl_file in enumerate(pkl_files, 1):
            print(f"\n进度: {i}/{total_files}")
            
            success, error = self.convert_single_pkl_file(pkl_file)
            
            if success:
                successful_conversions.append(pkl_file.name)
            else:
                failed_conversions.append((pkl_file.name, error))
        
        # 显示最终统计
        self.print_final_statistics(total_files, successful_conversions, failed_conversions)
        
        # 创建转换报告
        self.create_conversion_report(total_files, successful_conversions, failed_conversions)
        
        return {
            'total': total_files,
            'successful': len(successful_conversions),
            'failed': len(failed_conversions),
            'successful_files': successful_conversions,
            'failed_files': failed_conversions
        }
    
    def print_final_statistics(self, total_files, successful_conversions, failed_conversions):
        """打印最终统计信息"""
        print(f"\n{'='*80}")
        print("转换完成统计")
        print(f"{'='*80}")
        print(f"总PKL文件数: {total_files}")
        print(f"成功转换: {len(successful_conversions)}")
        print(f"转换失败: {len(failed_conversions)}")
        print(f"成功率: {(len(successful_conversions)/total_files*100):.1f}%")
        
        if successful_conversions:
            print(f"\n✓ 成功转换的文件 ({len(successful_conversions)}个):")
            for i, filename in enumerate(successful_conversions[:10], 1):  # 只显示前10个
                print(f"  {i}. {filename}")
            if len(successful_conversions) > 10:
                print(f"  ... 还有 {len(successful_conversions) - 10} 个文件")
        
        if failed_conversions:
            print(f"\n✗ 转换失败的文件 ({len(failed_conversions)}个):")
            for i, (filename, error) in enumerate(failed_conversions[:10], 1):  # 只显示前10个
                print(f"  {i}. {filename}: {error[:100]}...")
            if len(failed_conversions) > 10:
                print(f"  ... 还有 {len(failed_conversions) - 10} 个失败文件")
        
        print(f"\n输出目录: {self.output_dir}")
    
    def format_file_size(self, size_bytes):
        """格式化文件大小"""
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size_bytes < 1024:
                return f"{size_bytes:.1f} {unit}"
            size_bytes /= 1024
        return f"{size_bytes:.1f} TB"
    
    def create_conversion_report(self, total_files, successful_conversions, failed_conversions):
        """创建详细的转换报告"""
        report = f"""
# LLM响应单文件转换报告

## 转换时间
{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## 转换统计
- 总PKL文件数: {total_files}
- 成功转换: {len(successful_conversions)}
- 转换失败: {len(failed_conversions)}
- 成功率: {(len(successful_conversions)/total_files*100):.1f}%

## 输出目录
{self.output_dir}

## 转换模式
每个PKL文件转换为对应的JSON文件，保持相同的文件名

## 成功转换的文件列表
"""
        
        if successful_conversions:
            for i, filename in enumerate(successful_conversions, 1):
                json_filename = filename.replace('.pkl', '.json')
                report += f"{i}. {filename} -> {json_filename}\n"
        else:
            report += "无成功转换的文件\n"
        
        report += "\n## 失败文件详情\n"
        
        if failed_conversions:
            for i, (filename, error) in enumerate(failed_conversions, 1):
                report += f"{i}. {filename}\n"
                report += f"   错误: {error}\n\n"
        else:
            report += "无失败文件\n"
        
        # 保存报告
        report_path = self.output_dir / f"conversion_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
        
        with open(report_path, 'w', encoding='utf-8') as f:
            f.write(report)
        
        print(f"✓ 转换报告已保存: {report_path}")

def main():
    """主函数"""
    # 固定路径配置
    llm_response_path = "/Users/roychen/Desktop/xhs/Rednote/LLMResponse"
    output_dir = "/Users/roychen/Desktop/xhs/xiaohongshu/frontend/public/data/all_llm_response"
    
    print("LLM响应PKL转JSON单文件转换工具")
    print("=" * 80)
    print(f"输入目录: {llm_response_path}")
    print(f"输出目录: {output_dir}")
    print("转换模式: 每个PKL文件转换为对应的JSON文件")
    print("=" * 80)
    
    # 验证输入路径
    if not Path(llm_response_path).exists():
        print(f"✗ LLMResponse目录不存在: {llm_response_path}")
        sys.exit(1)
    
    # 创建转换器并执行转换
    converter = LLMResponseConverter(llm_response_path, output_dir)
    result = converter.convert_all_llm_responses()
    
    if result and result['successful'] > 0:
        print(f"\n✓ LLM响应转换完成！")
        print(f"成功转换: {result['successful']}/{result['total']} 个文件")
        print(f"输出目录: {output_dir}")
    else:
        print(f"\n✗ 转换失败或没有成功转换的文件")
        if result:
            print(f"失败文件数: {result['failed']}")
        sys.exit(1)

if __name__ == "__main__":
    main()