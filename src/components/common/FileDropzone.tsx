import React, { useRef, useState } from 'react'
import { Upload } from 'lucide-react'

export interface FileDropzoneProps {
  accept?: string
  onFileSelect: (file: File) => void
  title?: string
  subtitle?: string
  className?: string
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  accept = 'image/*',
  onFileSelect,
  title = '点击选择文件 或 将文件拖拽至此处',
  subtitle = '支持常见文件格式，纯浏览器本地运算保障隐私',
  className = '',
}) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      onFileSelect(file)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileSelect(file)
    }
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
        isDragOver
          ? 'border-primary-500 bg-primary-50/50 scale-[1.01]'
          : 'border-slate-300 hover:border-primary-400 bg-slate-50/50 hover:bg-primary-50/20'
      } ${className}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
        aria-label={title}
      />
      <div className="flex flex-col items-center justify-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600 transition-transform hover:scale-110">
          <Upload className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">{title}</p>
          <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
        </div>
      </div>
    </div>
  )
}
