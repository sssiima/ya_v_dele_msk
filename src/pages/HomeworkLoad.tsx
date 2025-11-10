import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fileUploadApi } from '@/services/api';

interface HomeworkLoadProps {
  title?: string;
  preview?: string;
  desclink?: string;
  desc?: string;
  prezlink?: string;
  templink?: string;
  teamCode?: string;
  onSuccess?: () => void;
}

const HomeworkLoad: React.FC<HomeworkLoadProps> = ({ 
  title,
  preview, 
  desclink, 
  desc, 
  prezlink, 
  templink,
  teamCode,
  onSuccess
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Логируем teamCode при монтировании компонента для отладки
  React.useEffect(() => {
    console.log('HomeworkLoad mounted with teamCode:', teamCode);
  }, [teamCode]);

  const extractFileId = (url: string) => {
    if (!url) return '';
    const match = url.match(/\/file\/d\/([^\/]+)/);
    return match && match[1] ? match[1] : url;
  };

  const getDownloadLink = (url: string) => {
    const fileId = extractFileId(url);
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  };

  const handleAttachFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
      } else {
        alert('Пожалуйста, выберите файл в формате PDF');
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Пожалуйста, сначала выберите файл');
      return;
    }
  
    setUploading(true);
    try {
      // Проверяем и логируем teamCode перед отправкой
      console.log('Uploading homework with teamCode:', teamCode);
      const result = await fileUploadApi.uploadHomework(selectedFile, title || 'Домашнее задание', teamCode);
      
      console.log('Upload result:', result);
      
      if (result.success && result.data) {
        alert('Файл успешно загружен и сохранен в базе!');
        
        // Вместо navigate вызываем колбэк onSuccess
        if (onSuccess) {
          onSuccess();
        } else {
          // fallback если колбэк не передан
          navigate('/profile-member');
        }
      } else {
        throw new Error(result.message || 'Ошибка загрузки файла');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Ошибка при загрузке файла: ' + (error as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="py-4">
      <div className="">
        {/* Кнопка назад */}
        <button 
          onClick={() => {
            if (onSuccess) {
              onSuccess();
            } else {
              navigate('/profile-member');
            }
          }}
          className="flex items-center text-brand mb-2 hover:underline"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Назад к заданиям
        </button>

        {/* Скрытый input для выбора файла */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept=".pdf,application/pdf"
          style={{ display: 'none' }}
        />

        {/* Детали мероприятия */}
        <div>
          <h2 className="text-lg font-bold text-brand normal-case text-center">Загрузка домашнего задания</h2>
          <p className="text-md font-bold text-black mb-4 normal-case text-center">{title}</p>

          <div style={{ backgroundColor: '#08A6A5'}} className="h-px w-auto my-4" />
          <div className="flex flex-col lg:flex-1 lg:min-h-0 lg:mb-7 gap-2">
            <div className="h-full">
              <p className="text-black text-xs leading-relaxed border border-brand rounded-2xl p-2 pl-4 lg:h-full">
                {preview}
              </p>
            </div>
            <a href={desclink ? getDownloadLink(desclink) : ''} download className='text-brand underline text-sm font-semibold block'>Подробное описание задания</a>
            <div className="h-full">
              <p className="text-black text-xs leading-relaxed border border-brand rounded-2xl p-2 pl-4 lg:h-full whitespace-pre-line">
                {desc}
              </p>
            </div>
            <a href={prezlink ? getDownloadLink(prezlink) : ''} download className='text-brand underline text-sm font-semibold block'>Презентация</a>
            {templink && templink.includes('drive.google.com') && (
              <a href={getDownloadLink(templink)} download className='text-brand underline text-sm font-semibold block'>Шаблон для выполнения д/з</a>
            )}
          </div>

          <div style={{ backgroundColor: '#08A6A5'}} className="h-px w-auto my-4 mt-6" />

          {/* Информация о выбранном файле */}
          {selectedFile && (
            <div className="mb-3 p-2 border border-green-500 rounded-lg bg-green-50">
              <p className="text-xs text-green-700">
                Выбран файл: <strong>{selectedFile.name}</strong> 
                ({Math.round(selectedFile.size / 1024)} KB)
              </p>
            </div>
          )}

          <div className="flex flex-row gap-2">
            <button 
              onClick={handleAttachFile}
              className='w-full rounded-xl bg-white hover:bg-gray-200 text-brand font-bold text-xs border border-brand p-1'
            >
              {selectedFile ? 'Изменить файл' : 'Прикрепить файл'}
            </button>
            <button 
              onClick={handleUpload}
              disabled={uploading || !selectedFile}
              className='w-full rounded-xl bg-brand hover:bg-teal-600 text-white font-bold text-xs p-1 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {uploading ? 'Загрузка...' : 'Отправить на проверку'}
            </button>
          </div>
          <p className='italic text-xs mt-2'>*Принимается файл в формате PDF, если он будет битый, за д/з автоматически выставится 0 баллов</p>
        </div>
      </div>
    </div>
  );
};

export default HomeworkLoad;