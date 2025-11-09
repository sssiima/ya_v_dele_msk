import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fileUploadApi, homeworksApi, teamsApi, structureApi, Homework } from '@/services/api';

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
  
  // Состояния для статусов
  const [isMember, setIsMember] = useState(false);
  const [isStructure, setIsStructure] = useState(false);
  const [userRole, setUserRole] = useState<string>('');
  const [userFullName, setUserFullName] = useState<string>('');
  const [memberTeamCode, setMemberTeamCode] = useState<string | null>(null);
  const [memberHomeworkStatus, setMemberHomeworkStatus] = useState<{ status: 'uploaded' | 'reviewed' | null, mark?: number } | null>(null);
  const [structureTeams, setStructureTeams] = useState<any[]>([]);
  const [teamsHomeworks, setTeamsHomeworks] = useState<{[teamCode: string]: Homework[]}>({});

  // Определяем тип пользователя и загружаем данные
  useEffect(() => {
    const loadUserData = async () => {
      const memberId = localStorage.getItem('member_id');
      const structureCtid = localStorage.getItem('structure_ctid');
      
      if (memberId) {
        // Пользователь - участник
        setIsMember(true);
        setIsStructure(false);
        
        // Загружаем данные участника и его домашние задания
        try {
          const { membersApi } = await import('@/services/api');
          const resp = await membersApi.getById(Number(memberId));
          const member = resp?.data;
          
          if (member && member.team_code) {
            setMemberTeamCode(member.team_code);
            
            // Загружаем домашние задания команды
            const homeworksResult = await homeworksApi.getByTeamCode(member.team_code);
            if (homeworksResult?.success && homeworksResult.data) {
              const homeworks = homeworksResult.data;
              // Ищем домашнее задание по названию (title)
              const homework = homeworks.find(hw => {
                const normalizedHwName = (hw.hw_name || '').trim();
                const normalizedTitle = (title || '').trim();
                return normalizedHwName === normalizedTitle;
              });
              
              if (homework) {
                if (homework.status === 'uploaded') {
                  setMemberHomeworkStatus({ status: 'uploaded' });
                } else if (homework.status === 'reviewed') {
                  setMemberHomeworkStatus({ status: 'reviewed', mark: homework.mark });
                }
              } else {
                setMemberHomeworkStatus({ status: null });
              }
            }
          }
        } catch (error) {
          console.error('Error loading member data:', error);
        }
      } else if (structureCtid) {
        // Пользователь - структура
        setIsMember(false);
        setIsStructure(true);
        
        // Загружаем данные структуры
        try {
          const { structureApi } = await import('@/services/api');
          const resp = await structureApi.getByCtid(structureCtid);
          const structure = resp?.data;
          
          if (structure) {
            setUserRole(structure.pos || '');
            const fullName = `${structure.last_name || ''} ${structure.first_name || ''}`.trim();
            setUserFullName(fullName);
            
            // Загружаем команды в зависимости от роли
            let teams: any[] = [];
            
            if (structure.pos === 'наставник' || structure.pos === 'старший наставник' || structure.pos === 'координатор' || structure.pos === 'руководитель округа') {
              // Получаем команды наставника
              const userTeamsResult = await teamsApi.getByMentor(fullName);
              const userTeams = userTeamsResult?.data || [];
              teams = [...userTeams];
              
              // Для координаторов и РО - получаем команды подчиненных
              if ((structure.pos === 'координатор' || structure.pos === 'руководитель округа')) {
                // Загружаем подчиненных и их команды
                const allStructure = await structureApi.getAll();
                const allPeople = allStructure?.data || [];
                
                if (structure.pos === 'руководитель округа') {
                  // РО видит команды наставников своего округа
                  const mentorPeople = allPeople.filter(person => 
                    person.pos === 'наставник' && person.ro === structure.ro
                  );
                  for (const mentor of mentorPeople) {
                    const mentorName = `${mentor.last_name || ''} ${mentor.first_name || ''}`.trim();
                    if (mentorName) {
                      try {
                        const mentorTeamsResult = await teamsApi.getByMentor(mentorName);
                        const mentorTeams = mentorTeamsResult?.data || [];
                        teams = [...teams, ...mentorTeams];
                      } catch (e) {
                        console.error(`Failed to load teams for mentor ${mentorName}:`, e);
                      }
                    }
                  }
                } else if (structure.pos === 'координатор') {
                  // Координатор видит команды наставников своего кураторства
                  const mentorPeople = allPeople.filter(person => 
                    person.pos === 'наставник' && person.coord === fullName
                  );
                  for (const mentor of mentorPeople) {
                    const mentorName = `${mentor.last_name || ''} ${mentor.first_name || ''}`.trim();
                    if (mentorName) {
                      try {
                        const mentorTeamsResult = await teamsApi.getByMentor(mentorName);
                        const mentorTeams = mentorTeamsResult?.data || [];
                        teams = [...teams, ...mentorTeams];
                      } catch (e) {
                        console.error(`Failed to load teams for mentor ${mentorName}:`, e);
                      }
                    }
                  }
                }
              } else if (structure.pos === 'старший наставник') {
                // Старший наставник видит команды наставников своей группы
                const allStructure = await structureApi.getAll();
                const allPeople = allStructure?.data || [];
                const mentorPeople = allPeople.filter(person => 
                  person.pos === 'наставник' && person.high_mentor === fullName
                );
                for (const mentor of mentorPeople) {
                  const mentorName = `${mentor.last_name || ''} ${mentor.first_name || ''}`.trim();
                  if (mentorName) {
                    try {
                      const mentorTeamsResult = await teamsApi.getByMentor(mentorName);
                      const mentorTeams = mentorTeamsResult?.data || [];
                      teams = [...teams, ...mentorTeams];
                    } catch (e) {
                      console.error(`Failed to load teams for mentor ${mentorName}:`, e);
                    }
                  }
                }
              }
              
              // Удаляем дубликаты
              const uniqueTeams = teams.filter((team, index, self) => 
                index === self.findIndex(t => t.code === team.code)
              );
              
              setStructureTeams(uniqueTeams);
              
              // Загружаем домашние задания для всех команд
              const homeworksMap: {[teamCode: string]: Homework[]} = {};
              for (const team of uniqueTeams) {
                if (team.code) {
                  try {
                    const homeworksResult = await homeworksApi.getByTeamCode(team.code);
                    if (homeworksResult?.success && homeworksResult.data) {
                      homeworksMap[team.code] = homeworksResult.data;
                    }
                  } catch (e) {
                    console.error(`Failed to load homeworks for team ${team.code}:`, e);
                  }
                }
              }
              setTeamsHomeworks(homeworksMap);
            }
          }
        } catch (error) {
          console.error('Error loading structure data:', error);
        }
      }
    };
    
    loadUserData();
  }, [title]);

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
      // Используем teamCode из пропсов или из состояния участника
      const finalTeamCode = teamCode || memberTeamCode;
      console.log('Uploading homework with teamCode:', finalTeamCode);
      const result = await fileUploadApi.uploadHomework(selectedFile, title || 'Домашнее задание', finalTeamCode || undefined);
      
      console.log('Upload result:', result);
      
      if (result.success && result.data) {
        alert('Файл успешно загружен и сохранен в базе!');
        
        // Обновляем статус для участника
        if (isMember && memberTeamCode) {
          setMemberHomeworkStatus({ status: 'uploaded' });
        }
        
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
            <a href={templink ? getDownloadLink(templink): ''} download className='text-brand underline text-sm font-semibold block'>Шаблон для выполнения д/з</a>
          </div>

          <div style={{ backgroundColor: '#08A6A5'}} className="h-px w-auto my-4 mt-6" />

          {/* Отображение статуса для участника */}
          {isMember && memberHomeworkStatus && (
            <div className="mb-4">
              <div className={`flex justify-between items-center border border-brand rounded-full p-2 px-4 ${
                memberHomeworkStatus.status === 'uploaded' || memberHomeworkStatus.status === 'reviewed' 
                  ? 'bg-white text-black' 
                  : 'bg-brand text-white'
              }`}>
                <span className="text-sm">Статус выполнения</span>
                <div className="flex items-center gap-2">
                  {memberHomeworkStatus.status === 'uploaded' ? (
                    <span className="text-xs lg:text-sm italic text-[#FF5500]">На проверке</span>
                  ) : memberHomeworkStatus.status === 'reviewed' ? (
                    <span className="text-xs lg:text-sm text-brand">
                      <span className="font-bold">{memberHomeworkStatus.mark}</span> баллов
                    </span>
                  ) : (
                    <span className="text-xs lg:text-sm">Не выполнено</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Отображение статусов для структуры */}
          {isStructure && structureTeams.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Статусы выполнения командами:</h3>
              <div className="space-y-2">
                {structureTeams.map((team) => {
                  const teamHomeworks = teamsHomeworks[team.code] || [];
                  const normalizedTitle = (title || '').trim();
                  const homework = teamHomeworks.find(hw => {
                    const normalizedHwName = (hw.hw_name || '').trim();
                    return normalizedHwName === normalizedTitle;
                  });
                  
                  return (
                    <div key={team.code} className="flex justify-between items-center border border-brand rounded-full p-2 px-4 bg-white">
                      <span className="text-sm text-black">{team.name || team.code}</span>
                      <div className="flex items-center gap-2">
                        {homework ? (
                          homework.status === 'uploaded' ? (
                            <span className="text-xs lg:text-sm italic text-[#FF5500]">На проверке</span>
                          ) : homework.status === 'reviewed' ? (
                            <span className="text-xs lg:text-sm text-brand">
                              <span className="font-bold">{homework.mark}</span> баллов
                            </span>
                          ) : (
                            <span className="text-xs lg:text-sm text-gray-500">Не выполнено</span>
                          )
                        ) : (
                          <span className="text-xs lg:text-sm text-pink-500">Не выполнили</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
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

          {/* Кнопки загрузки только для участников */}
          {isMember && (
            <>
              <div className="flex flex-row gap-2">
                <button 
                  onClick={handleAttachFile}
                  className='w-full rounded-xl bg-white hover:bg-gray-200 text-brand font-bold text-xs border border-brand p-1'
                >
                  {selectedFile ? 'Изменить файл' : 'Прикрепить файл'}
                </button>
                <button 
                  onClick={handleUpload}
                  disabled={uploading || !selectedFile || memberHomeworkStatus?.status === 'uploaded' || memberHomeworkStatus?.status === 'reviewed'}
                  className='w-full rounded-xl bg-brand hover:bg-teal-600 text-white font-bold text-xs p-1 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {uploading ? 'Загрузка...' : 'Отправить на проверку'}
                </button>
              </div>
              <p className='italic text-xs mt-2'>*Принимается файл в формате PDF, если он будет битый, за д/з автоматически выставится 0 баллов</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeworkLoad;