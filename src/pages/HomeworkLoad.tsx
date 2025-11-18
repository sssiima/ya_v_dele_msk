import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fileUploadApi, teamsApi } from '@/services/api';

interface HomeworkLoadProps {
  title?: string;
  preview?: string;
  desclink?: string;
  desc?: string;
  prezlink?: string;
  templink?: string;
  teamCode?: string;
  onSuccess?: () => void;
  homeworkNumber?: number;
}

const HomeworkLoad: React.FC<HomeworkLoadProps> = ({ 
  title,
  preview, 
  desclink, 
  desc, 
  prezlink, 
  templink,
  teamCode,
  onSuccess,
  homeworkNumber
}) => {
  const getDeadline = (hwNumber?: number): string | null => {
    if (!hwNumber) return null;
    const deadlines: { [key: number]: string } = {
      1: '17 ноября 2025',
      2: '24 ноября 2025',
      3: '1 декабря 2025',
      4: '8 декабря 2025'
    };
    return deadlines[hwNumber] || null;
  };

  const deadline = getDeadline(homeworkNumber);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [teamTrack, setTeamTrack] = useState<string | null>(null);
  const [loadingTrack, setLoadingTrack] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<string>('');
  const [showTrackSelector, setShowTrackSelector] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const trackSelectorRef = useRef<HTMLDivElement>(null);
  const lastUploadTimeRef = useRef<number>(0);
  const navigate = useNavigate();

  const tracks = ['Базовый', 'Социальный', 'Инновационный'];

  // Загружаем трек команды, если это второе д/з
  useEffect(() => {
    const loadTeamTrack = async () => {
      if (homeworkNumber === 2 && teamCode) {
        setLoadingTrack(true);
        try {
          const normalizedTeamCode = String(teamCode).trim();
          if (normalizedTeamCode && normalizedTeamCode !== '' && normalizedTeamCode !== 'null' && normalizedTeamCode !== 'undefined') {
            const teamResult = await teamsApi.getByCode(normalizedTeamCode);
            if (teamResult?.success && teamResult.data?.track) {
              const track = teamResult.data.track;
              setTeamTrack(track);
              // Если трек уже выбран, используем его
              if (track && (track === 'Базовый' || track === 'Социальный' || track === 'Инновационный')) {
                setSelectedTrack(track);
              }
            } else {
              setTeamTrack(null);
            }
          }
        } catch (error) {
          setTeamTrack(null);
        } finally {
          setLoadingTrack(false);
        }
      }
    };

    loadTeamTrack();
  }, [homeworkNumber, teamCode]);

  // Обработка клика вне селектора трека
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (trackSelectorRef.current && !trackSelectorRef.current.contains(event.target as Node)) {
        setShowTrackSelector(false);
      }
    };
    if (showTrackSelector) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTrackSelector]);


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
    // Проверка задержки между нажатиями (500 мс)
    const now = Date.now();
    if (now - lastUploadTimeRef.current < 500) {
      return;
    }
    lastUploadTimeRef.current = now;

    if (!selectedFile) {
      alert('Пожалуйста, сначала выберите файл');
      return;
    }

    // Для второго д/з проверяем наличие трека
    if (homeworkNumber === 2) {
      const finalTrack = selectedTrack || teamTrack;
      if (!finalTrack || (finalTrack !== 'Базовый' && finalTrack !== 'Социальный' && finalTrack !== 'Инновационный')) {
        alert('Пожалуйста, выберите трек перед загрузкой задания');
        return;
      }
    }

    // Проверяем наличие teamCode перед загрузкой
    // teamCode может быть строкой или числом, нормализуем его
    let normalizedTeamCode: string | undefined = undefined;
    if (teamCode !== null && teamCode !== undefined) {
      const teamCodeStr = String(teamCode).trim();
      if (teamCodeStr !== '' && teamCodeStr !== 'null' && teamCodeStr !== 'undefined') {
        normalizedTeamCode = teamCodeStr;
      }
    }
    
    if (!normalizedTeamCode) {
      alert('Ошибка: не удалось определить код команды. Убедитесь, что вы являетесь участником команды. Если проблема сохраняется, обратитесь к администратору.');
      setUploading(false);
      return;
    }
  
    setUploading(true);
    try {
      // Для второго д/з передаем трек
      const trackToSend = homeworkNumber === 2 ? (selectedTrack || teamTrack || undefined) : undefined;
      const result = await fileUploadApi.uploadHomework(
        selectedFile, 
        title || 'Домашнее задание', 
        normalizedTeamCode,
        trackToSend
      );
      
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

          {/* Дедлайн */}
          {deadline && (
            <div className="mb-4 p-3 border border-brand rounded-lg bg-gray-50">
              <p className="text-sm font-semibold text-black mb-1">
                ДЗ {homeworkNumber}
              </p>
              <p className="text-xs text-gray-700">
                закрывается {deadline}
              </p>
            </div>
          )}

          {/* Информация о выбранном файле */}
          {selectedFile && (
            <div className="mb-3 p-2 border border-green-500 rounded-lg bg-green-50">
              <p className="text-xs text-green-700">
                Выбран файл: <strong>{selectedFile.name}</strong> 
                ({Math.round(selectedFile.size / 1024)} KB)
              </p>
            </div>
          )}

          {/* Выбор трека для второго д/з */}
          {homeworkNumber === 2 && (
            <div className="mb-4 relative" ref={trackSelectorRef}>
              <label className="block text-sm font-semibold text-black mb-2">Трек</label>
              {loadingTrack ? (
                <div className="w-full px-4 py-2 border border-brand rounded-full bg-gray-50 text-center">
                  <span className="text-xs text-gray-500">Загрузка...</span>
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setShowTrackSelector(!showTrackSelector)}
                    className="w-full px-4 py-2 border border-brand rounded-full bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {selectedTrack || teamTrack || 'Выберите трек'}
                  </button>
                  {showTrackSelector && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-brand rounded-lg shadow-lg max-h-48 overflow-y-auto" style={{ maxHeight: '192px', overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
                      {tracks.map((track) => (
                        <button
                          key={track}
                          type="button"
                          onClick={() => {
                            setSelectedTrack(track);
                            setShowTrackSelector(false);
                          }}
                          className={`w-full px-4 py-2 text-left hover:bg-gray-100 ${
                            (selectedTrack === track || (!selectedTrack && teamTrack === track)) 
                              ? 'bg-brand/10 border-l-4 border-brand' 
                              : ''
                          }`}
                        >
                          {track}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
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
              disabled={uploading || !selectedFile || (homeworkNumber === 2 && !selectedTrack && !teamTrack)}
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