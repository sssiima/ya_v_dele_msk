import { useState, useEffect, useCallback, useRef } from 'react';
import { membersApi, structureApi, teamsApi, vusesApi, homeworksApi, Homework, fileUploadApi } from '@/services/api'
import CalendarPage from '@/components/CalendarPage';
import TeamPage from '@/components/TeamPage';
import { useNavigate } from 'react-router-dom'
import HomeworkLoad from './HomeworkLoad';

interface Vus {
  id: number
  vus: string
}


// Типы для данных
interface Mk {
  title: string;
  subtitle: string;
  image: string;
  link?: string;
  pres: string;
  criteria: string;
  tz: string;
  track?: string;
  disabled?: boolean;
  description: string;
  template: string;
  fulldesc: string;
}

interface TeamMember {
  id: number;
  number: number;
  fullName: string;
  isCaptain: boolean;
}

interface TeamData {
  teamName: string;
  track: string;
  teamCode: string;
  mentor: string;
  coordinator: string;
  districtManager: string;
  projectDescription: string;
  projectSite: string;
  teamMembers: TeamMember[];
  isEditingTeamName: boolean;
  isEditingProjectDescription: boolean;
}

interface MemberData {
  id: number;
  last_name: string;
  first_name: string;
  patronymic: string;
  username: string;
  education: string;
  level: string;
  grade: string;
  faculty: string;
  format: string;
  phone: string;
  vk_link: string;
  birth_date: string;
  gender: string;
  team_code: string;
  role: string;
  team_name: string;
  mentor: string;
  track?: string;
}

const Card = ({ title, subtitle, image, link, disabled }: { title?: string, subtitle?: string, image?: string, link?: string, disabled?: boolean }) => (
  <div className="flex flex-col w-[210px] flex-shrink-0">
    {link && !disabled ? (
      <a href={link} target="_blank">
        <img src={image} className="rounded-xl w-64 cursor-pointer hover:opacity-90 transition-opacity" />
      </a>
    ) : (
      <img src={image} className="rounded-xl w-64" />
    )}
    {title && (
      <>
        <p className="text-center text-brand font-bold text-sm mt-2 mb-1">
          {title}
        </p>
      </>
    )}
    {subtitle && (
      <>
        <p className="text-center text-black font-bold text-xs">
          {subtitle}
        </p>
      </>
    )}
  </div>
)

// Компонент загрузки домашнего задания для промежуточного воркшопа
interface WorkshopHomeworkLoadProps {
  teamCode?: string;
  onSuccess?: () => void;
}

const WorkshopHomeworkLoad: React.FC<WorkshopHomeworkLoadProps> = ({ 
  teamCode,
  onSuccess
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<string>('');
  const [showTrackSelector, setShowTrackSelector] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const trackSelectorRef = useRef<HTMLDivElement>(null);

  const tracks = ['Базовый', 'Социальный', 'Инновационный'];

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

  const handleAttachFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf') {
        // Проверка размера файла (50MB)
        if (file.size > 50 * 1024 * 1024) {
          alert('Файл слишком большой. Максимальный размер: 50MB');
          return;
        }
        setSelectedFile(file);
      } else {
        alert('Пожалуйста, выберите файл в формате PDF');
      }
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert('Пожалуйста, сначала выберите файл');
      return;
    }

    if (!selectedTrack) {
      alert('Пожалуйста, выберите трек');
      return;
    }

    setUploading(true);
    try {
      // Загружаем файл с треком
      const result = await fileUploadApi.uploadHomework(
        selectedFile, 
        'Промежуточный ВШ', 
        teamCode || undefined,
        selectedTrack
      );

      if (result.success && result.data) {
        alert('Презентация успешно загружена!');
        if (onSuccess) {
          onSuccess();
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
    <div className="py-4 w-full">
        {/* Кнопка назад */}
        <button 
          onClick={() => {
            if (onSuccess) {
              onSuccess();
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

        <h2 className="text-lg font-bold text-brand normal-case text-center mb-4">
          Промежуточный воркшоп
        </h2>

        <div style={{ backgroundColor: '#08A6A5'}} className="h-px w-auto my-4" />

        {/* Описание критериев */}
        <div className="mb-4">
          <p className="text-sm font-semibold text-black mb-2">Описание критериев:</p>
          <div className="border border-brand rounded-2xl p-4">
            <ol className="list-decimal list-inside space-y-2 text-sm text-black">
              <li>Формулировка проблемы</li>
              <li>Описание решения и идеи проекта</li>
              <li>Актуальность проблемы</li>
              <li>Портрет целевой аудитории</li>
              <li>УТП</li>
              <li>MVP</li>
              <li>Дизайн</li>
            </ol>
          </div>
        </div>

        <div style={{ backgroundColor: '#08A6A5'}} className="h-px w-auto my-4" />

        {/* Кнопка загрузки презентации */}
        <div className="mb-4">
          <button 
            onClick={handleAttachFile}
            className='w-full rounded-xl bg-white hover:bg-gray-200 text-brand font-bold text-xs border border-brand p-3'
          >
            {selectedFile ? 'Изменить файл' : 'Загрузить презентацию'}
          </button>
          {selectedFile && (
            <div className="mt-2 p-2 border border-green-500 rounded-lg bg-green-50">
              <p className="text-xs text-green-700">
                Выбран файл: <strong>{selectedFile.name}</strong> 
                ({Math.round(selectedFile.size / 1024 / 1024 * 100) / 100} MB)
              </p>
            </div>
          )}
          <p className='italic text-xs mt-2 text-gray-600'>
            *Принимается файл в формате PDF до 50MB
          </p>
          
          {/* Информация о названиях презентаций */}
          <div className="mt-3 p-3 border border-brand rounded-lg bg-gray-50">
            <p className="text-xs font-semibold text-black mb-2">Пример названий презентаций:</p>
            <p className="text-xs text-black mb-2">
              <span className="font-semibold">Название презентации:</span> название проекта без сокращений
            </p>
            <p className="text-xs text-black mb-2">
              Например: <span className="font-bold text-brand">Чистые улочки</span>
            </p>
            <p className="text-xs text-black">
              Как НЕ подходит: <span className="text-pink">Чистые улочки ИТОГ</span>, <span className="italic text-pink">Чист. улочки (2)</span>
            </p>
          </div>
        </div>

        {/* Выбор трека */}
        <div className="mb-48 relative" ref={trackSelectorRef}>
          <label className="block text-sm font-semibold text-black mb-2">Трек</label>
          <button
            type="button"
            onClick={() => setShowTrackSelector(!showTrackSelector)}
            className="w-full px-4 py-2 border border-brand rounded-full bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {selectedTrack || 'Выберите трек'}
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
                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                    selectedTrack === track ? 'bg-brand text-white' : 'text-black'
                  }`}
                >
                  {track}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Кнопка отправить */}
        <button 
          onClick={handleSubmit}
          disabled={uploading || !selectedFile || !selectedTrack}
          className='w-full rounded-xl bg-brand hover:bg-teal-600 text-white font-bold text-sm p-3 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {uploading ? 'Загрузка...' : 'Отправить'}
        </button>
    </div>
  );
};

const ProfilePageMember = () => {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sect, setSect] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [isProfileExpanded, setIsProfileExpanded] = useState(false)
  const [lastname, setLastname] = useState('')
  const [firstname, setFirstname] = useState('')
  const [patronymic, setPatronymic] = useState('')
  const [email, setEmail] = useState('')
  const [university, setUniversity] = useState('')
  const [educationLevel, setEducationLevel] = useState('')
  const [course, setCourse] = useState('')
  const [faculty, setFaculty] = useState('')
  const [educationForm, setEducationForm] = useState('')
  const [phone, setPhone] = useState('')
  const [vkLink, setVkLink] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [gender, setGender] = useState('')

  const [selectedMk, setSelectedMk] = useState<Mk | null>(null);

  const [memberData, setMemberData] = useState<MemberData | null>(null)
  const [teamHomeworks, setTeamHomeworks] = useState<Homework[]>([])

  const [currentHomeworkView, setCurrentHomeworkView] = useState<number | null>(null);
  const [showWorkshopHomework, setShowWorkshopHomework] = useState(false);
  
  // Состояния для статусов мастер-классов
  const [mkHomeworkStatus, setMkHomeworkStatus] = useState<{ status: 'uploaded' | 'reviewed' | null, mark?: number } | null>(null);
  const [structureTeamsForMk, setStructureTeamsForMk] = useState<any[]>([]);
  const [teamsHomeworksForMk, setTeamsHomeworksForMk] = useState<{[teamCode: string]: Homework[]}>({});

  const handleHomeworkClick = (homeworkNumber: number) => {
    // Первые два мастер-класса (индексы 0 и 1) не имеют д/з, поэтому используем homeworkNumber + 1
    // Д/з 1 -> мк 3 (индекс 2), д/з 2 -> мк 4 (индекс 3) и т.д.
    setCurrentHomeworkView(homeworkNumber + 2);
  };
  
  const handleWorkshopHomeworkClick = () => {
    setShowWorkshopHomework(true);
  };

  // Функция для получения номера д/з по индексу мастер-класса
  const getHomeworkNumberByMkIndex = (mkIndex: number): number | null => {
    // Первые два мастер-класса (индексы 0 и 1) не имеют д/з
    // Д/з 1 -> мк 3 (индекс 2), д/з 2 -> мк 4 (индекс 3) и т.д.
    if (mkIndex < 2) return null;
    return mkIndex - 1; // Индекс 2 -> ДЗ 1, индекс 3 -> ДЗ 2, и т.д.
  };

  // Функция для получения дедлайна по номеру д/з
  const getDeadline = (hwNumber: number): string | null => {
    const deadlines: { [key: number]: string } = {
      1: '17 ноября 2025',
      2: '24 ноября 2025',
      3: '1 декабря 2025',
      4: '8 декабря 2025'
    };
    return deadlines[hwNumber] || null;
  };

  // Функция для проверки статуса домашнего задания по номеру
  const getHomeworkStatus = (homeworkNumber: number): { status: 'uploaded' | 'reviewed' | null, mark?: number } => {
    // По номеру домашки обращаемся к соответствующей записи из массива mk_list
    // Первые два мастер-класса (индексы 0 и 1) не имеют д/з, поэтому используем homeworkNumber + 1
    // Д/з 1 -> мк 3 (индекс 2), д/з 2 -> мк 4 (индекс 3) и т.д.
    const mkIndex = homeworkNumber + 1
    if (!mk_list[mkIndex]) return { status: null }
    
    const mkItem = mk_list[mkIndex]
    const mkSubtitle = mkItem?.subtitle
    if (!mkSubtitle) return { status: null }
    
    // Сверяем subtitle с hw_name в записи в БД
    // Нормализуем строки для более надежного сопоставления (убираем лишние пробелы)
    const normalizedSubtitle = mkSubtitle.trim()
    const homework = teamHomeworks.find(hw => {
      const normalizedHwName = (hw.hw_name || '').trim()
      return normalizedHwName === normalizedSubtitle
    })
    
    // Если у этой записи статус uploaded, возвращаем 'uploaded'
    if (homework && homework.status === 'uploaded') {
      return { status: 'uploaded' }
    }
    
    // Если у этой записи статус reviewed, возвращаем 'reviewed' с баллом
    if (homework && homework.status === 'reviewed') {
      return { status: 'reviewed', mark: homework.mark }
    }
    
    return { status: null }
  }
  
  // Функция для проверки статуса промежуточного воркшопа
  const getWorkshopHomeworkStatus = (): { status: 'uploaded' | 'reviewed' | null, mark?: number } => {
    const homework = teamHomeworks.find(hw => {
      const normalizedHwName = (hw.hw_name || '').trim()
      return normalizedHwName === 'Промежуточный ВШ'
    })
    
    if (homework && homework.status === 'uploaded') {
      return { status: 'uploaded' }
    }
    
    if (homework && homework.status === 'reviewed') {
      return { status: 'reviewed', mark: homework.mark }
    }
    
    return { status: null }
  }

  const handleMkClick = async (mk: Mk) => {
    if (!mk.disabled) {
      setSelectedMk(mk);
      
      // Загружаем статусы домашних заданий для этого мастер-класса
      const memberId = localStorage.getItem('member_id');
      const structureCtid = localStorage.getItem('structure_ctid');
      
      if (memberId && memberData?.team_code) {
        // Участник - загружаем статус его команды
        try {
          const homeworksResult = await homeworksApi.getByTeamCode(memberData.team_code);
          if (homeworksResult?.success && homeworksResult.data) {
            const homeworks = homeworksResult.data;
            const normalizedSubtitle = (mk.subtitle || '').trim();
            const homework = homeworks.find(hw => {
              const normalizedHwName = (hw.hw_name || '').trim();
              return normalizedHwName === normalizedSubtitle;
            });
            
            if (homework) {
              if (homework.status === 'uploaded') {
                setMkHomeworkStatus({ status: 'uploaded' });
              } else if (homework.status === 'reviewed') {
                setMkHomeworkStatus({ status: 'reviewed', mark: homework.mark });
              } else {
                setMkHomeworkStatus({ status: null });
              }
            } else {
              setMkHomeworkStatus({ status: null });
            }
          }
        } catch (error) {
          console.error('Error loading homework status:', error);
          setMkHomeworkStatus({ status: null });
        }
      } else if (structureCtid) {
        // Структура - загружаем команды и их статусы
        try {
          const resp = await structureApi.getByCtid(structureCtid);
          const structure = resp?.data;
          
          if (structure) {
            const fullName = `${structure.last_name || ''} ${structure.first_name || ''}`.trim();
            let teams: any[] = [];
            
            if (structure.pos === 'наставник' || structure.pos === 'старший наставник' || structure.pos === 'координатор' || structure.pos === 'руководитель округа') {
              // Получаем команды наставника
              const userTeamsResult = await teamsApi.getByMentor(fullName);
              const userTeams = userTeamsResult?.data || [];
              teams = [...userTeams];
              
              // Для координаторов и РО - получаем команды подчиненных
              if ((structure.pos === 'координатор' || structure.pos === 'руководитель округа')) {
                const allStructure = await structureApi.getAll();
                const allPeople = allStructure?.data || [];
                
                if (structure.pos === 'руководитель округа') {
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
              
              setStructureTeamsForMk(uniqueTeams);
              
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
              setTeamsHomeworksForMk(homeworksMap);
            }
          }
        } catch (error) {
          console.error('Error loading structure teams:', error);
        }
      }
    }
  };

  const handleBackToMks = () => {
    setSelectedMk(null);
    setMkHomeworkStatus(null);
    setStructureTeamsForMk([]);
    setTeamsHomeworksForMk({});
  };

  const scrollContainerRefmk = useRef<HTMLDivElement>(null);
    const [activeDotmk, setActiveDotmk] = useState(0);
    const scrollContainerRefpr = useRef<HTMLDivElement>(null);
    const [activeDotpr, setActiveDotpr] = useState(0);
    const scrollContainerRefpod = useRef<HTMLDivElement>(null);
    const [activeDotpod, setActiveDotpod] = useState(0);

  
    const mk_list = [
      { title: "Первый мастер-класс", subtitle: 'Проблема. Идея. Решение', image: '/images/mkfirst.png',
        pres: 'https://drive.google.com/file/d/1dJd3mA8eFmKksPX5FQrkTO7XF0mlkOZN/view?usp=drive_link',
        description: 'Всем привет! Вот и пришло время для первого домашнего задания. Сегодня мы попробуем развить предпринимательское мышление через выявление реальных проблем в нашей повседневной жизни, подумаем над их решениями и сгенерируем собственные.',
        disabled: false,
        criteria: '',
        tz: '',
        template: '',
        fulldesc: '' },
      { title: "Второй мастер-класс", subtitle: 'Customer development. ЦА.', image: '/images/mksecond.png',
        pres: 'https://drive.google.com/file/d/1ET9n5nxgyf5KzRSqwBqRIb2v0aWFx84D/view?usp=drive_link',
        description: 'Пришло время учиться анализировать целевую аудиторию и проводить кастдевы. Сегодня вас ждут два увлекательных задания. Погнали!',
        disabled: false,
        criteria: '',
        tz: '',
        template: '',
        fulldesc: '' },
      { title: "Третий мастер-класс", subtitle: 'MVP. HADI - циклы.', image: '/images/mkthirdopen.png',
        pres: 'https://drive.google.com/file/d/1KACuNbGwN4b2DXXe3eXNz9pyIhoRO7Nu/view?usp=drive_link',
        description: 'После мастер-класса вы сформировали представление о минимально жизнеспособном продукте (MVP), который каждый из вас будет готов представить на финальном воркшопе курса. Сегодня попробуем его визуально представить. Да, так тоже можно!',
        disabled: false,
        criteria: '',
        tz: 'https://drive.google.com/file/d/16YNXVqiC3g4rq9C-XGzoGLNkUTTbkT7a/view?usp=drive_link',
        template: '',
        fulldesc: `Критерии оценки домашнего задания No 3: «MVP, НADI - циклы»

1. Реалистичность MVP
MVP возможно реализовать до конца курса в таком виде, в каком он сгенерирован на картинке.

2. Качество и конкретность промта
Промт чётко структурирован, содержит все необходимые параметры (описание проекта, ограничения по времени/ресурсам, требуемый функционал MVP), написан понятным языком.

3. Соответствие MVP сути проекта MVP демонстрирует ключевую ценность проекта, показывает основную функцию или решает главную проблему целевой аудитории.`  },
      { title: "Четвертый мастер-класс", subtitle: 'Бизнес - модель.', image: '/images/mkfourthlock.png',
        pres: 'https://drive.google.com/file/d/15mRrdWcEHA_NtpT0QEaNv_pmSs9UJZAN/view?usp=drive_link',
        description: 'Поздравляем вас с прохождением половины предпринимательского курса! Теперь готовимся к финишной прямой - начинаем усердную подготовку к воркшопу. В этой домашней работе вы изучите идею проекта через призму различных элементов бизнес-модели. Это поможет вам увидеть возможности монетизации с разных сторон и понять, какие варианты заработка лучше всего подходят именно вашему проекту.',
        disabled: true, track: 'Базовый трек',
        criteria: '',
        tz: 'https://drive.google.com/file/d/1OBoQL-0RFGMyeiBA1dcWux3KqoIY3Q3R/view?usp=drive_link',
        template: '',
        fulldesc: `Критерии оценки домашнего задания No 4: «Бизнес -
модель»

1. Правильность выбора элементов бизнес-модели
Участник выбрал три разных элемента из списка, приведённого в теории.
Каждый элемент чётко соответствует понятию бизнес-модели, отсутствуют
повторения. Элементы классифицированы правильно, с соблюдением
терминологии.

2. Применимость к проекту
Каждый элемент подробно описан с чётким объяснением, как он
функционирует в рамках конкретного проекта. Участник демонстрирует
глубокое понимание механики монетизации и её связи с проектом.

3. Определение целевой аудитории
Для каждого бизнес-элемента чётко указана и описана целевая аудитория,
отличающаяся по характеру для разных элементов. Описание глубокое и
релевантное.

4. Анализ выгод для проекта
В каждом элементе описаны конкретные, разнообразные выгоды —
например, финансовые (доход, прибыль), стратегические
(масштабируемость), операционные (снижение затрат), маркетинговые ]
(привлечение клиентов).

5. Понимание ценностного предложения
В четвёрке каждого элемента раскрыт смысл ценностного предложения:
почему клиент выбирает этот элемент, какую проблему решает проект,
какова выгода. Используется или хотя бы отражается формула «помогает...
решить... благодаря... даёт...».

6. Дополнительный балл за оригинальность и глубину проработки
Ответ глубоко проработан, оригинален, содержит нестандартные идеи,
творческий подход к применению элементов.`  },
      { title: "Пятый мастер-класс", subtitle: 'Финансы.', image: '/images/mkfifthlock.png',
        pres: 'https://drive.google.com/file/d/1KZEn8Clb9KC1Lh4dR5GRtiI3YrU7CX_6/view?usp=drive_link',
        description: 'Друзья, пришло время примерить на себя роль настоящих финансовых гениев! Сегодня вы не просто будете считать - вы станете финансовыми детективами, стратегами и магами цифр.',
        disabled: true, track: 'Базовый трек',
        criteria: '',
        tz: 'https://drive.google.com/file/d/1gC70ikWO7mt4GmWMfSbW4HaIVAcfQGZ9/view?usp=drive_link',
        template: '',
        fulldesc: `Критерии оценки домашнего задания No 5:
«Финансы»

Критерии оценки «Unit-экономика»

1. Корректность расчётов и понимание формул
Участник правильно использует формулы расчёта Unit Contribution и LTV. Все
значения логически согласованы между собой, отсутствуют арифметические
ошибки. Чётко видна связь между средним чеком, себестоимостью, CAC и
итоговыми метриками.

2. Разработка трёх сценариев
Построены три реалистичных сценария — оптимистичный, реалистичный и
пессимистичный. Отличия между ними логично объяснены и количественно
обоснованы (например, через динамику удержания или CAC).

3. Интерпретация показателей и выводы
Участник не просто приводит цифры, но объясняет, что они означают для
бизнеса: где «узкое место», в каком сценарии проект становится
прибыльным, что влияет на устойчивость модели.

4. Сравнение LTV и CAC
Показано соотношение LTV/CAC, сделаны выводы о целесообразности
бизнеса. Участник аргументирует, почему показатель выше или ниже
единицы, и какие управленческие решения можно принять на основе
данных.

5. Применимость к проекту
Все данные и гипотезы связаны с конкретным продуктом или идеей. Нет
«абстрактных» чисел — чувствуется логика реального бизнеса (откуда берутся
данные, какие каналы привлечения, какая структура цен).

Дополнительный балл за аналитичность и визуализацию
В таблице или слайде присутствует график/диаграмма, показывающий
динамику или сравнение сценариев. Отчёт аккуратен, выводы кратки, но
точны и осмысленны.

Критерии оценки «Себестоимость под микроскопом»

1. Полнота разбора себестоимости
Себестоимость продукта разложена на отдельные элементы: материалы,
упаковку, аренду, рекламу, труд и прочие расходы. Указаны конкретные цены
и источники данных (магазины, прайс-листы, сайты поставщиков).

2. Реалистичность и точность данных
Все значения основаны на реальных рыночных данных. Расчёты корректны,
логика формирования итоговой себестоимости понятна. Пропорции между
статьями затрат соответствуют типу продукта.

3. Сравнение с рыночной ценой
Выполнено сопоставление итоговой себестоимости с ценами конкурентов
или средними рыночными значениями. Участник объясняет, за что клиент
платит и как формируется цена.

4. Анализ издержек и возможностей оптимизации
Для каждой статьи указаны точки оптимизации: где можно сократить
расходы, не ухудшая качество, а где экономия нежелательна. Участник
демонстрирует понимание приоритетов — что важно для ценности продукта.

5. Осмысление ценностного предложения
В работе объясняется, почему клиент готов платить эту цену — какие
эмоциональные, функциональные или имиджевые выгоды получает.
Участник показывает понимание связи между себестоимостью, ценой и
восприятием продукта.

6. Дополнительный балл за визуализацию и структурность
Себестоимость представлена в виде схемы (Canva, Miro, таблица). Работа
оформлена аккуратно, содержит пояснения, цвета или группировки для
наглядности. Присутствует краткий итог с ключевыми выводами.`  },
      { title: "Шестой мастер-класс", subtitle: 'Маркетинг.', image: '/images/mksixthlock.png',
        pres: 'https://drive.google.com/file/d/1-ICPM2FI3bkJuMimfSe2SUr2w8OPrcOE/view?usp=drive_link',
        description: 'Помните ли вы завирусившуюся рекламу Тантум Верде Форте? А скитлстрянку? Или, быть может, легко можете напеть фразу “Мерси, благодарю тебя...” и даже вспомните её продолжение. Задумывались ли вы когда-то, почему эти фразы так въелись в вашу память? Все дело в качественно построенном маркетинге продукта и его удачной рекламной компании.',
        disabled: true, track: 'Базовый трек',
        criteria: '',
        tz: 'https://drive.google.com/file/d/1NdI0WnrllO2GpxIeRIBDflf876xjdDDy/view?usp=drive_link',
        template: '',
        fulldesc: `Критерии оценки домашнего задания No 6: «Маркетинг»

Задание 1: Анализ маркетингового кейса

1. Глубина анализа проблемы
Участники демонстрируют глубокий анализ:
— Выявляют все ключевые психологические триггеры (социальное
доказательство, FOMO, принадлежность к сообществу, игровой элемент)
— Объясняют, почему именно эти триггеры сработали именно с молодежью
— Приводят конкретные примеры из кейса, подтверждающие анализ
— Ссылаются на теории маркетинга или поведения потребителей

2. Понимание механики вирусности рекламы
— Четко описано, в какой момент зритель становится участником
— Названы все условия, необходимые для вирусности (простота
воспроизведения, эмоциональность, социальная ценность контента,
возможность адаптации)
— Объяснено, почему другим брендам выгодно было поддержать кампанию

3. Анализ рисков
— Выявлены несколько серьезных рисков (потеря контроля над нарративом,
критика, черный пиар, негативные коннотации, непредсказуемость толпы и
т.д.)
— Для каждого риска объяснено, как его можно было минимизировать

4. Адаптация под собственный продукт
— Выбран конкретный продукт и четко описана его суть
Аналог билборда оригинален и уместен для продукта
— Выбранный психологический механизм релевантен и хорошо объяснен
— Персонажи (имена, характеристики) продуманы и логичны для целевой
аудитории

5. Измеримость результатов
— Названо минимум 5 конкретных метрик (установки приложения, показы в
соцсетях, CTR, конверсия, упоминания бренда, engagement и т.д.)
— Четко определена самая важная метрика и объяснено почему
— Описаны KPI для остановки кампании (например, падение engagement
ниже 5% или отрицательный sentiment)

Задание 2: Создание рекламного ролика для собственного продукта (дополнительное)

1. Глубина раскрытия сути проекта.
Смотря рекламу можно без проблем понять, о чем и для кого создан
продукт/услуга.

2. Способность увлечь.
Реклама запоминается, завлекает внимание зрителя с первых секунд.

3. Креативность и оригинальность идеи.
Поддерживается творческий и нестандартный подход.`  },
      // { title: "Второй мастер-класс", subtitle: 'Бизнес - модель. Социальный трек', image: '/images/mkfourthsoc.png',
      //   pres: 'https://drive.google.com/file/d/1kjEMVwHUYcX9UvqyAJizJohVFVeX_R0K/view?usp=drive_link',
      //   description: 'Поздравляем вас с прохождением половины предпринимательского курса! Теперь готовимся к финишной прямой - начинаем усердную подготовку к воркшопу. В этой домашней работе вы изучите идею проекта через призму различных элементов бизнес-модели. Это поможет вам увидеть возможности монетизации с разных сторон и понять, какие варианты заработка лучше всего подходят именно вашему проекту.',
      //   disabled: true, track: 'Социальный трек',
      //   criteria: '',
      //   tz: 'https://drive.google.com/file/d/1sH-5hekaOJifBTJh7i3hHJTtDhsK0N7w/view?usp=drive_link',
      //   template: '', fulldesc: ''  },
      // { title: "Третий мастер-класс", subtitle: 'Финансы. Социальный трек', image: '/images/mkfifthsoc.png',
      //   pres: 'https://drive.google.com/file/d/1wJeZcuuyTVpy4pOunOH_5Z92d6eaxSMT/view?usp=drive_link',
      //   description: 'Друзья, пришло время примерить на себя роль настоящих финансовых гениев! Сегодня вы не просто будете считать - вы станете финансовыми детективами, стратегами и магами цифр.',
      //   disabled: true, track: 'Социальный трек',
      //   criteria: '',
      //   tz: 'https://drive.google.com/file/d/18l90yVyIsOemFnkyQcFAh3pxyZzS0pLG/view?usp=drive_link',
      //   template: '', fulldesc: ''  },
      // { title: "Четвертый мастер-класс", subtitle: 'Маркетинг. Социальный трек', image: '/images/mksixthsoc.png',
      //   pres: 'https://drive.google.com/file/d/1-bKB_NEDgbMvLkJpAvRq2b-3XDHTxawY/view?usp=drive_link',
      //   description: 'Помните ли вы завирусившуюся рекламу Тантум Верде Форте? А скитлстрянку? Или, быть может, легко можете напеть фразу “Мерси, благодарю тебя...” и даже вспомните её продолжение. Задумывались ли вы когда-то, почему эти фразы так въелись в вашу память? Все дело в качественно построенном маркетинге продукта и его удачной рекламной компании.',
      //   disabled: true, track: 'Социальный трек',
      //   criteria: '',
      //   tz: 'https://drive.google.com/file/d/1YRlVOwsQHohX7QqdbF2d2SIEiFJNhPWc/view?usp=drive_link',
      //   template: '', fulldesc: ''  },
      // { title: "Второй мастер-класс", subtitle: 'Бизнес - модель. Инновационный трек', image: '/images/mkfourthinn.png',
      //   pres: 'https://drive.google.com/file/d/1O4tW61bHzY1YWLAqJ6bzGq09-VGUIKy5/view?usp=drive_link',
      //   description: 'Поздравляем вас с прохождением половины предпринимательского курса! Теперь готовимся к финишной прямой - начинаем усердную подготовку к воркшопу. В этой домашней работе вы изучите идею проекта через призму различных элементов бизнес-модели. Это поможет вам увидеть возможности монетизации с разных сторон и понять, какие варианты заработка лучше всего подходят именно вашему проекту.',
      //   disabled: true, track: 'Инновационный трек',
      //   criteria: '',
      //   tz: 'https://drive.google.com/file/d/12YITLqF4tidK-OWnO1C8W7XbfkYRhsqq/view?usp=drive_link',
      //   template: '', fulldesc: ''  },
      // { title: "Третий мастер-класс", subtitle: 'Финансы. Инновационный трек', image: '/images/mkfifthinn.png',
      //   pres: 'https://drive.google.com/file/d/1eEB2WVfku9Wg5x5salXk2Bh7Cc9rUUHv/view?usp=drive_link',
      //   description: 'Друзья, пришло время примерить на себя роль настоящих финансовых гениев! Сегодня вы не просто будете считать - вы станете финансовыми детективами, стратегами и магами цифр.',
      //   disabled: true, track: 'Инновационный трек',
      //   criteria: '',
      //   tz: 'https://drive.google.com/file/d/19QSMPcsMBtjyJdLJon0YfzNgHhn50mX9/view?usp=drive_link',
      //   template: '', fulldesc: ''  },
      // { title: "Четвертый мастер-класс", subtitle: 'Маркетинг. Инновационный трек', image: '/images/mksixthinn.png',
      //   pres: 'https://drive.google.com/file/d/1Q48DKHZL36Rql5eG-7mzT2TfA1bpfuvO/view?usp=drive_link',
      //   description: 'Помните ли вы завирусившуюся рекламу Тантум Верде Форте? А скитлстрянку? Или, быть может, легко можете напеть фразу “Мерси, благодарю тебя...” и даже вспомните её продолжение. Задумывались ли вы когда-то, почему эти фразы так въелись в вашу память? Все дело в качественно построенном маркетинге продукта и его удачной рекламной компании.',
      //   disabled: true, track: 'Инновационный трек',
      //   criteria: '',
      //   tz: 'https://drive.google.com/file/d/1gULz1yHW8kMc1vYekqmFMbwcj2g3OAM8/view?usp=drive_link',
      //   template: '', fulldesc: ''  },
  ]

  const project_list = [
      { title: "NutriCheck", subtitle: 'Социальный трек', image: '/images/nutricheck.png' },
      { title: "Модуль", subtitle: 'Базовый трек', image: '/images/module.png' },
      { title: "ПроОбраз-21", subtitle: 'Социальный трек', image: '/images/proobraz.png' },
      { title: "PyramidPack", subtitle: 'Базовый трек', image: '/images/pyramidpack.png' },
      { title: "Fillfood", subtitle: 'Социальный трек', image: '/images/fillfood.png' },
      { title: "FUN", subtitle: 'Базовый трек', image: '/images/fun.png' },
      { title: "Бионический протез пальца", subtitle: 'Инновационный трек', image: '/images/palets.png' },
  ]

  const podcast_list = [
      { title: "С психологом", image: '/images/podcast_psy.png', link: 'https://vkvideo.ru/video-210144042_456239649?pl=-210144042_2&t=3s'},
      { title: "Про путешествия", image: '/images/podcast_travel.png', link: 'https://vkvideo.ru/video-210144042_456239626?pl=-210144042_2' },
      { title: "Про личный бренд", image: '/images/podcast_brand.png', link: 'https://vkvideo.ru/video-210144042_456239623?pl=-210144042_2' },
      { title: "Про креативность", image: '/images/podcast_create.png', link: 'https://vkvideo.ru/video-210144042_456239575?pl=-210144042_2' },
      { title: "Про страхи и рост", image: '/images/podcast_fear.png', link: 'https://vkvideo.ru/video-210144042_456239501?pl=-210144042_2' },
  ]

  const handleScrollmk = useCallback(() => {
    const container = scrollContainerRefmk.current;
    if (!container) return;

    const scrollLeft = container.scrollLeft;
    const containerWidth = container.clientWidth;
    const cardWidth = 205; // w-[120px]
    const gap = 12; // space-x-3 = 12px
    
    // Вычисляем индекс активной карточки
    const scrollPosition = scrollLeft + containerWidth / 2;
    const activeIndex = Math.floor(scrollPosition / (cardWidth + gap));
    
    setActiveDotmk(Math.min(activeIndex, mk_list.length - 1));
  }, [mk_list.length]);

  // Функция для скролла к определенной точке
  const scrollToDotmk = (index: number) => {
    const container = scrollContainerRefmk.current;
    if (!container) return;

    const cardWidth = 205; // w-[205px]
    const gap = 12; // space-x-3 = 12px
    const scrollPosition = index * (cardWidth + gap);
    
    container.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
  };

  const handleScrollpr = useCallback(() => {
      const container = scrollContainerRefpr.current;
      if (!container) return;
  
      const scrollLeft = container.scrollLeft;
      const containerWidth = container.clientWidth;
      const cardWidth = 205; // w-[120px]
      const gap = 12; // space-x-3 = 12px
      
      // Вычисляем индекс активной карточки
      const scrollPosition = scrollLeft + containerWidth / 2;
      const activeIndex = Math.floor(scrollPosition / (cardWidth + gap));
      
      setActiveDotpr(Math.min(activeIndex, project_list.length - 1));
    }, [project_list.length]);
  
    // Функция для скролла к определенной точке
    const scrollToDotpr = (index: number) => {
      const container = scrollContainerRefpr.current;
      if (!container) return;
  
      const cardWidth = 205; // w-[200px]
      const gap = 12; // space-x-3 = 12px
      const scrollPosition = index * (cardWidth + gap);
      
      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    };

    const handleScrollpod = useCallback(() => {
      const container = scrollContainerRefpod.current;
      if (!container) return;
  
      const scrollLeft = container.scrollLeft;
      const containerWidth = container.clientWidth;
      const cardWidth = 205; // w-[120px]
      const gap = 12; // space-x-3 = 12px
      
      // Вычисляем индекс активной карточки
      const scrollPosition = scrollLeft + containerWidth / 2;
      const activeIndex = Math.floor(scrollPosition / (cardWidth + gap));
      
      setActiveDotpod(Math.min(activeIndex, podcast_list.length - 1));
    }, [podcast_list.length]);
  
    // Функция для скролла к определенной точке
    const scrollToDotpod = (index: number) => {
      const container = scrollContainerRefpod.current;
      if (!container) return;
  
      const cardWidth = 205; // w-[200px]
      const gap = 12; // space-x-3 = 12px
      const scrollPosition = index * (cardWidth + gap);
      
      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      })
    }

  // Данные команды
  const [teamData, setTeamData] = useState<TeamData>({
    teamName: '',
    track: '',
    teamCode: '',
    mentor: '',
    coordinator: '',
    districtManager: '',
    projectDescription: '',
    projectSite: '',
    teamMembers: [],
    isEditingTeamName: false,
    isEditingProjectDescription: false
  })
  const [isEditingTeamNameOnly, setIsEditingTeamNameOnly] = useState(false)
  const [tempTeamName, setTempTeamName] = useState('')
  const [isEditingTeamData, setIsEditingTeamData] = useState(false)
  const [tempTeamNameForEdit, setTempTeamNameForEdit] = useState('')

  const [tempLastname, setTempLastname] = useState(lastname)
  const [tempFirstname, setTempFirstname] = useState(firstname)
  const [tempPatronymic, setTempPatronymic] = useState(patronymic)
  const [tempEmail, setTempEmail] = useState(email)
  const [tempUniversity, setTempUniversity] = useState(university)
  const [tempEducationLevel, setTempEducationLevel] = useState(educationLevel)
  const [tempCourse, setTempCourse] = useState(course)
  
  // Состояние для автодополнения ВУЗов
  const [vuses, setVuses] = useState<Vus[]>([])
  const [filteredVuses, setFilteredVuses] = useState<Vus[]>([])
  const [showVusSuggestions, setShowVusSuggestions] = useState(false)
  const [tempFaculty, setTempFaculty] = useState(faculty)
  const [tempEducationForm, setTempEducationForm] = useState(educationForm)
  const [tempPhone, setTempPhone] = useState(phone)
  const [tempVkLink, setTempVkLink] = useState(vkLink)
  const [tempBirthDate, setTempBirthDate] = useState(birthDate)
  const [tempGender, setTempGender] = useState(gender)

  const [showHomework, setShowHomework] = useState(false);

  const handleButtonClick = () => {
    setShowHomework(true);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const pageSelected = (page: string) => {
    setSect(page)
    setIsMenuOpen(!isMenuOpen)
    if (page==='courses') {
      setShowHomework(false)
      setSelectedMk(null)
      
    }
    if (page ==='myteam') {
      setCurrentHomeworkView(null)
    }
  }

  const handleEditProfile = () => {
    // Инициализируем все временные значения исходными данными
    setTempLastname(lastname || '')
    setTempFirstname(firstname || '')
    setTempPatronymic(patronymic || '')
    setTempEmail(email || '')
    setTempUniversity(university || '')
    setTempEducationLevel(educationLevel || '')
    setTempCourse(course || '')
    setTempFaculty(faculty || '')
    setTempEducationForm(educationForm || '')
    setTempPhone(phone || '')
    setTempVkLink(vkLink || '')
    setTempBirthDate(birthDate || '')
    setTempGender(gender || '')
    setIsEditing(true)
    setIsProfileExpanded(true)
  }

  const handleSaveProfile = async () => {
    // Оптимистично обновляем UI
    setLastname(tempLastname)
    setFirstname(tempFirstname)
    setPatronymic(tempPatronymic)
    setEmail(tempEmail)
    setUniversity(tempUniversity)
    setEducationLevel(tempEducationLevel)
    setCourse(tempCourse)
    setFaculty(tempFaculty)
    setEducationForm(tempEducationForm)
    setPhone(tempPhone)
    setVkLink(tempVkLink)
    setBirthDate(tempBirthDate)
    setGender(tempGender)
    setIsEditing(false)

    try {
      const memberId = Number(localStorage.getItem('member_id'))
      if (!memberId) return
      await membersApi.update(memberId, {
        last_name: tempLastname,
        first_name: tempFirstname,
        patronymic: tempPatronymic,
        username: tempEmail,
        education: tempUniversity,
        level: tempEducationLevel,
        grade: tempCourse,
        faculty: tempFaculty,
        format: tempEducationForm,
        phone: tempPhone,
        vk_link: tempVkLink,
        birth_date: tempBirthDate,
        gender: tempGender,
      })
    } catch (e) {
      console.error('Failed to save profile:', e)
      // опционально: показать уведомление об ошибке/вернуть старые значения
    }
  }

  const handleCancelEdit = () => {
    // Сбрасываем все временные значения к исходным
    setTempLastname(lastname || '')
    setTempFirstname(firstname || '')
    setTempPatronymic(patronymic || '')
    setTempEmail(email || '')
    setTempUniversity(university || '')
    setTempEducationLevel(educationLevel || '')
    setTempCourse(course || '')
    setTempFaculty(faculty || '')
    setTempEducationForm(educationForm || '')
    setTempPhone(phone || '')
    setTempVkLink(vkLink || '')
    setTempBirthDate(birthDate || '')
    setTempGender(gender || '')
    setIsEditing(false)
  }

  const extractFileId = (url: string) => {
    if (!url) return '';
    const match = url.match(/\/file\/d\/([^\/]+)/);
    return match && match[1] ? match[1] : url;
  };

  const getDownloadLink = (url: string) => {
    const fileId = extractFileId(url);
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  };

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Загрузка ВУЗов
  useEffect(() => {
    const fetchVuses = async () => {
      try {
        const response = await vusesApi.getAll()
        if (response.success && response.data) {
          setVuses(response.data)
          setFilteredVuses(response.data)
        }
      } catch (error) {
        console.error('Error fetching VUSes:', error)
      }
    }
    fetchVuses()
  }, [])

  // Фильтрация ВУЗов при вводе
  useEffect(() => {
    if (tempUniversity && tempUniversity.length > 1) {
      const filtered = vuses.filter(vus => 
        vus.vus.toLowerCase().includes(tempUniversity.toLowerCase())
      )
      setFilteredVuses(filtered)
      setShowVusSuggestions(true)
    } else {
      setFilteredVuses(vuses)
      setShowVusSuggestions(false)
    }
  }, [tempUniversity, vuses])

  const handleVusSelect = (vusName: string) => {
    setTempUniversity(vusName)
    setShowVusSuggestions(false)
  }

  // Загрузка данных пользователя и команды
  useEffect(() => {
    const memberId = Number(localStorage.getItem('member_id'))
    if (!memberId) return
    
    const loadUserData = async () => {
      try {
        // Загрузка данных пользователя
        const resp = await membersApi.getById(memberId)
        const m: MemberData = resp?.data
        setMemberData(m)
        if (!m) return
        
        setLastname(m.last_name || '')
        setFirstname(m.first_name || '')
        setPatronymic(m.patronymic || '')
        setEmail(m.username || '')
        setUniversity(m.education || '')
        setEducationLevel(m.level || '')
        setCourse(m.grade || '')
        setFaculty(m.faculty || '')
        setEducationForm(m.format || '')
        setPhone(m.phone || '')
        setVkLink(m.vk_link || '')
        setBirthDate(m.birth_date ? m.birth_date.substring(0,10) : '')
        setGender(m.gender || '')

        // Если у пользователя есть код команды, загружаем данные команды
        if (m.team_code) {
          await loadTeamData(m.team_code)
          // Загружаем домашние задания команды
          try {
            const homeworksResult = await homeworksApi.getByTeamCode(m.team_code)
            if (homeworksResult?.success && homeworksResult.data) {
              setTeamHomeworks(homeworksResult.data)
            }
          } catch (error) {
            console.error('Error loading team homeworks:', error)
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error)
      }
    }

    loadUserData()
  }, [])

  // Синхронизируем временные значения с исходными, когда данные загружаются (только если не в режиме редактирования)
  useEffect(() => {
    if (!isEditing) {
      setTempLastname(lastname)
      setTempFirstname(firstname)
      setTempPatronymic(patronymic)
      setTempEmail(email)
      setTempUniversity(university)
      setTempEducationLevel(educationLevel)
      setTempCourse(course)
      setTempFaculty(faculty)
      setTempEducationForm(educationForm)
      setTempPhone(phone)
      setTempVkLink(vkLink)
      setTempBirthDate(birthDate)
      setTempGender(gender)
    }
  }, [lastname, firstname, patronymic, email, university, educationLevel, course, faculty, educationForm, phone, vkLink, birthDate, gender, isEditing])

// Функция для загрузки координатора и руководителя округа
const loadCoordRo = async (mentorFullName: string): Promise<{ coordinator: string; districtManager: string }> => {
  try {
    if (!mentorFullName || mentorFullName === 'Наставник не назначен') {
      return {
        coordinator: 'Координатор не назначен',
        districtManager: 'Руководитель округа не назначен'
      };
    }

    // Получаем все данные из structureApi
    const structureResp = await structureApi.getAll();
    const structureData = structureResp?.data || [];

    if (!structureData || structureData.length === 0) {
      return {
        coordinator: 'Координатор не назначен',
        districtManager: 'Руководитель округа не назначен'
      };
    }

    // Разделяем ФИО наставника на части
    const nameParts = mentorFullName.trim().split(/\s+/).filter(part => part.length > 0);
    
    if (nameParts.length < 2) {
      return {
        coordinator: 'Координатор не назначен',
        districtManager: 'Руководитель округа не назначен'
      };
    }

    let coordinator = 'Координатор не назначен';
    let districtManager = 'Руководитель округа не назначен';

    // Ищем в структуре по имени и фамилии
    for (const item of structureData) {
      // Проверяем разные комбинации имени и фамилии
      const matches = (
        (item.last_name === nameParts[0] && item.first_name === nameParts[1]) ||
        (item.last_name === nameParts[1] && item.first_name === nameParts[0])
      );

      if (matches) {
        coordinator = item.coord || coordinator;
        districtManager = item.ro || districtManager;
        break; // Нашли совпадение, выходим из цикла
      }
    }

    return {
      coordinator,
      districtManager
    };

  } catch (error) {
    console.error('Error loading coordinator and district manager:', error);
    return {
      coordinator: 'Координатор не назначен',
      districtManager: 'Руководитель округа не назначен'
    };
  }
};
// Функция загрузки данных команды
const loadTeamData = async (teamCode: string) => {
  try {
    // Загрузка данных команды из таблицы teams
    let teamTrack = 'Будет доступен после 1 Воркшопа'
    try {
      const teamResp = await teamsApi.getByCode(teamCode)
      if (teamResp?.success && teamResp.data?.track) {
        teamTrack = teamResp.data.track
      }
    } catch (error) {
      console.error('Error loading team track:', error)
    }
    
    // Загрузка всех участников команды
    const membersResp = await membersApi.getAll()
    const allMembers: MemberData[] = membersResp?.data || []
    
    // Фильтруем участников по коду команды
    const teamMembers = allMembers.filter((member: MemberData) => member.team_code === teamCode)
    
    // Находим капитана
    const captain = teamMembers.find((member: MemberData) => member.role === 'captain')

    // Получаем имя наставника из поля mentor любого участника команды
    const mentorName = teamMembers.length > 0 
      ? (teamMembers[0].mentor || 'Наставник не назначен')
      : 'Наставник не назначен'

    const { coordinator, districtManager } = await loadCoordRo(mentorName);
    
    // Форматируем участников для отображения
    const formattedMembers: TeamMember[] = teamMembers.map((member: MemberData, index: number) => ({
      id: member.id,
      number: index + 1,
      fullName: `${member.last_name || ''} ${member.first_name || ''} ${member.patronymic || ''}`.trim(),
      isCaptain: member.role === 'captain'
    }))

    setTeamData({
      teamName: captain?.team_name || 'Название команды не указано',
      track: teamTrack,
      teamCode: teamCode,
      mentor: mentorName,
      coordinator: coordinator,
      districtManager: districtManager,
      projectDescription: 'Будет доступно на 2 неделе курса',
      projectSite: 'Сайт проекта пока не добавлен',
      teamMembers: formattedMembers,
      isEditingTeamName: false,
      isEditingProjectDescription: false,
    })
  } catch (error) {
    console.error('Error loading team data:', error)
  }
}

  return (
    <section className="card p-0 overflow-hidden relative">
      
      <div className={`
        fixed top-0 right-0 h-full z-50
        transform transition-transform duration-300 ease-in-out
        ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        ${isMobile ? 'w-full' : 'w-[400px]'}
        bg-brand shadow-2xl 
      ` }>
        <div className="flex items-center justify-end p-6 pr-12">
          <button onClick={closeMenu} className="pr-4">
            <img src="/images/close.png" alt="close" className="w-6" />
          </button>
        </div>
        <div style={{ backgroundColor: 'white'}} className="h-px w-auto" />

        <nav className="p-6 pb-0">
          <ul className="space-y-2 flex flex-col items-center">
            <li>
              <button onClick={() => {pageSelected('profile')}} className={`flex items-center text-center space-x-4 p-2 text-xl text-white ${sect === 'profile' ? 'font-bold' : 'hover:font-bold'}`}>
                <span>Личный кабинет</span>
              </button>
            </li>
            <li>
              <button onClick={() => {pageSelected('myteam')}} className={`flex items-center space-x-4 p-2 text-xl text-white ${sect === 'myteam' ? 'font-bold' : 'hover:font-bold'}`}>
                <span>Моя команда</span>
              </button>
            </li>
            <li>
              <button onClick={() => {pageSelected('calendar')}} className={`flex items-center space-x-4 p-2 text-xl text-white ${sect === 'calendar' ? 'font-bold' : 'hover:font-bold'}`}>
                <span>Календарь программы</span>
              </button>
            </li>
            {/* <li>
              <button onClick={() => {pageSelected('team')}} className={`flex items-center space-x-4 p-2 text-xl text-white ${sect === 'team' ? 'font-bold' : 'hover:font-bold'}`}>
                <span>Команда программы</span>
              </button>
            </li> */}
            <li>
              <button onClick={() => {pageSelected('courses')}} className={`flex items-center space-x-4 p-2 text-xl text-white ${sect === 'courses' ? 'font-bold' : 'hover:font-bold'}`}>
                <span>Материалы курса</span>
              </button>
            </li>
          </ul>
        </nav>
        <div className='flex justify-center items-center flex-col'>
          <img src='images/logowhite.png' alt='logo' className='mt-10 w-80 z-0'/>
          <button onClick={() => {navigate('/')}} className='text-white font-semibold text-sm absolute bottom-6'>Выйти из аккаунта</button>
        </div>
      </div>

      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={closeMenu}
        />
      )}

      <div className="relative z-10">
        <header className="flex flex-col">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-2">
              <div aria-hidden>
                <img src="/images/location.png" alt="локация" className="w-4" />
              </div>
              <span className="text-sm font-semibold text-brand text-[16px]">Москва</span>
            </div>
            <div className="flex items-center space-x-4 px-2">
              <div aria-hidden>
                <button onClick={toggleMenu}>
                  <img 
                    src={isMenuOpen ? "/images/close.png" : "/images/menu.png"} 
                    alt={isMenuOpen ? "close" : "menu"} 
                    className="w-9"
                  />
                </button>
              </div>
            </div>
          </div>
          <div style={{ backgroundColor: '#08A6A5'}} className="h-px w-auto" />
        </header>
      </div>

      <div className="px-4 pb-0">
        {sect==='profile' && (
          <div className="lg:flex lg:gap-6">
            {/* Левая колонка - профиль */}
            <div className='baseinfo flex flex-col justify-center items-start mt-4 lg:flex-1'>
              <div className='flex flex-col lg:flex-row lg:items-start lg:gap-6 w-full'>
                {/* Аватар */}
                <div className='flex flex-row py-4 relative lg:flex-col lg:items-start'>
                  <div className='bg-[#D9D9D9] rounded-lg w-44 aspect-square'><img src='images/logomember.png' alt='profpic' className='rounded-lg'></img></div>
                  <img src='images/heading-icon.png' alt='logo' className='absolute w-48 right-5 lg:-right-0 lg:top-40'/>
                </div>
                
                {/* Основные поля (ФИО и остальная информация) */}
                <div className='lg:flex-1 lg:w-full'>
                  {/* Для мобильных устройств - обычное поведение */}
                  <div className='lg:hidden'>
                    {/* Режим 1: Только фамилия и имя + стрелка + кнопка редактировать */}
                    {!isProfileExpanded && !isEditing && (
                      <div className='w-full text-xs'>
                        <div className='mb-2 text-left'>
                          <p><strong>Фамилия</strong></p>
                          <input value={lastname} readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1 capitalize"/>
                        </div>
                        <div className='mb-4 text-left'>
                          <p><strong>Имя</strong></p>
                          <input value={firstname} readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1 capitalize"/>
                        </div>
                        
                        <div className='w-full flex flex-col items-center'>
                          <button onClick={() => setIsProfileExpanded(true)}>
                            <img 
                              src='images/arrow.png' 
                              alt='arrow' 
                              className='w-6 mt-2'
                            />
                          </button>
                          <button className='text-brand mt-2 hover:underline' onClick={handleEditProfile}>
                            Редактировать профиль
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Режим 2: Все поля (просмотр) + стрелка назад + кнопка редактировать */}
                    {isProfileExpanded && !isEditing && (
                      <div className='w-full text-xs'>
                        <div className='mb-2'>
                          <p><strong>Фамилия</strong></p>
                          <input value={lastname} readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1 capitalize"/>
                        </div>
                        <div className='mb-2'>
                          <p><strong>Имя</strong></p>
                          <input value={firstname} readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1 capitalize"/>
                        </div>
                        <div className='mb-2'>
                          <p><strong>Отчество</strong></p>
                          <input value={patronymic} readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1 capitalize"/>
                        </div>
                        <div className='mb-2'>
                          <p><strong>Электронная почта</strong></p>
                          <input value={email} readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                        </div>
                        <div className='mb-2'>
                          <p><strong>ВУЗ</strong></p>
                          <input value={university} readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                        </div>
                        <div className='flex flex-row gap-2 mb-2'>
                          <div className='flex-1'>
                            <p><strong>Уровень подготовки</strong></p>
                            <input value={educationLevel} readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                          </div>
                          <div className='flex-1'>
                            <p><strong>Курс обучения</strong></p>
                            <input value={course} readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                          </div>
                        </div>
                        <div className='flex flex-row gap-2 mb-2'>
                          <div className='flex-1'>
                            <p><strong>Факультет</strong></p>
                            <input value={faculty} readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                          </div>
                          <div className='flex-1'>
                            <p><strong>Форма обучения</strong></p>
                            <input value={educationForm} readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                          </div>
                        </div>
                        <div className='mb-2'>
                          <p><strong>Номер телефона</strong></p>
                          <input value={phone} readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                        </div>
                        <div className='mb-2'>
                          <p><strong>Ссылка на ВКонтакте</strong></p>
                          <input value={vkLink} readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                        </div>
                      <div className='flex flex-row gap-2 mb-2'>
                        <div className='flex-1'>
                          <p><strong>Дата рождения</strong></p>
                          <input value={birthDate} type='date' readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                        </div>
                        <div className='flex-1'>
                          <p><strong>Пол</strong></p>
                          <input value={gender === 'F' ? 'Женский' : gender === 'M' ? 'Мужской' : gender}
                           readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                        </div>
                      </div>
                      
                      <div className='w-full flex flex-col items-center lg:hidden'>
                          <button onClick={() => setIsProfileExpanded(false)}>
                            <img 
                              src='images/arrow.png' 
                              alt='arrow' 
                              className='w-6 mt-2 rotate-180'
                            />
                          </button>
                          <button className='text-brand mt-2 hover:underline' onClick={handleEditProfile}>
                            Редактировать профиль
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Десктоп версия - все поля под аватаром */}
                  {!isEditing && (
                    <div className='hidden lg:block w-full text-xs'>
                      <div className='flex flex-col gap-2 mb-4'>
                        <div>
                          <p><strong>Фамилия</strong></p>
                          <input value={lastname} readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1 capitalize"/>
                        </div>
                        <div>
                          <p><strong>Имя</strong></p>
                          <input value={firstname} readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1 capitalize"/>
                        </div>
                        <div>
                          <p><strong>Отчество</strong></p>
                          <input value={patronymic} readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1 capitalize"/>
                        </div>
                      </div>
                      
                      <div className='mb-2'>
                        <p><strong>Электронная почта</strong></p>
                        <input value={email} readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                      </div>
                      <div className='mb-2'>
                        <p><strong>ВУЗ</strong></p>
                        <input value={university} readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                      </div>
                      <div className='flex flex-row gap-2 mb-2'>
                        <div className='flex-1'>
                          <p><strong>Уровень подготовки</strong></p>
                          <input value={educationLevel} readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                        </div>
                        <div className='flex-1'>
                          <p><strong>Курс обучения</strong></p>
                          <input value={course} readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                        </div>
                      </div>
                      <div className='flex flex-row gap-2 mb-2'>
                        <div className='flex-1'>
                          <p><strong>Факультет</strong></p>
                          <input value={faculty} readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                        </div>
                        <div className='flex-1'>
                          <p><strong>Форма обучения</strong></p>
                          <input value={educationForm} readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                        </div>
                      </div>
                      <div className='mb-2'>
                        <p><strong>Номер телефона</strong></p>
                        <input value={phone} readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                      </div>
                      <div className='mb-2'>
                        <p><strong>Ссылка на ВКонтакте</strong></p>
                        <input value={vkLink} readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                      </div>
                      <div className='flex flex-row gap-2 mb-2'>
                        <div className='flex-1'>
                          <p><strong>Дата рождения</strong></p>
                          <input value={birthDate} type='date' readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                        </div>
                        <div className='flex-1'>
                          <p><strong>Пол</strong></p>
                          <input value={gender === 'F' ? 'Женский' : gender === 'M' ? 'Мужской' : gender}
                           readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                        </div>
                      </div>
                      
                      <div className='w-full flex flex-col items-center mt-4'>
                        <button className='text-brand mt-2 hover:underline' onClick={handleEditProfile}>
                          Редактировать профиль
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Режим 3: Редактирование (все поля активны) + кнопки сохранить/отменить */}
                  {isEditing && (
                    <div className='w-full text-xs'>
                      <div className='flex flex-col gap-2 mb-4'>
                        <div>
                          <p><strong>Фамилия</strong></p>
                          <input value={tempLastname} onChange={(e) => setTempLastname(e.target.value)} className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1 capitalize"/>
                        </div>
                        <div>
                          <p><strong>Имя</strong></p>
                          <input value={tempFirstname} onChange={(e) => setTempFirstname(e.target.value)} className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1 capitalize"/>
                        </div>
                        <div>
                          <p><strong>Отчество</strong></p>
                          <input value={tempPatronymic} onChange={(e) => setTempPatronymic(e.target.value)} className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1 capitalize"/>
                        </div>
                      </div>
                      
                      <div className='mb-2'>
                        <p><strong>Электронная почта</strong></p>
                        <input value={tempEmail} onChange={(e) => setTempEmail(e.target.value)} className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                      </div>
                      <div className='mb-2 relative'>
                        <p><strong>ВУЗ</strong></p>
                        <input 
                          value={tempUniversity} 
                          onChange={(e) => setTempUniversity(e.target.value)} 
                          className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"
                          placeholder="не обучаюсь в вузе"
                          autoComplete="off"
                          onFocus={() => tempUniversity && tempUniversity.length > 1 && setShowVusSuggestions(true)}
                          onBlur={() => setTimeout(() => setShowVusSuggestions(false), 200)}
                        />
                        {showVusSuggestions && filteredVuses.length > 0 && (
                          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {filteredVuses.map((vus) => (
                              <div
                                key={vus.id}
                                className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm text-gray-800"
                                onClick={() => handleVusSelect(vus.vus)}
                                onMouseDown={(e) => e.preventDefault()}
                              >
                                {vus.vus}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className='mb-2'>
                        <p><strong>Уровень подготовки</strong></p>
                        <select 
                          value={tempEducationLevel} 
                          onChange={(e) => setTempEducationLevel(e.target.value)} 
                          className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"
                        >
                          <option value="">Выберите уровень</option>
                          <option value="бакалавриат">Бакалавриат</option>
                          <option value="специалитет">Специалитет</option>
                          <option value="магистратура">Магистратура</option>
                          <option value="аспирантура">Аспирантура</option>
                        </select>
                      </div>
                      <div className='flex flex-row gap-2 mb-2'>
                        <div className='flex-1'>
                          <p><strong>Курс обучения</strong></p>
                          <select 
                            value={tempCourse} 
                            onChange={(e) => setTempCourse(e.target.value)} 
                            className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"
                          >
                            <option value="">Выберите курс</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                          </select>
                        </div>
                        <div className='flex-1'>
                          <p><strong>Форма обучения</strong></p>
                          <select 
                            value={tempEducationForm} 
                            onChange={(e) => setTempEducationForm(e.target.value)} 
                            className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"
                          >
                            <option value="">Выберите форму</option>
                            <option value="очная">Очная</option>
                            <option value="очнозаочная">Очно-заочная</option>
                            <option value="заочная">Заочная</option>
                          </select>
                        </div>
                      </div>
                      <div className='mb-2'>
                        <p><strong>Факультет</strong></p>
                        <input value={tempFaculty} onChange={(e) => setTempFaculty(e.target.value)} className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                      </div>
                      <div className='mb-2'>
                        <p><strong>Номер телефона</strong></p>
                        <input value={tempPhone} onChange={(e) => setTempPhone(e.target.value)} className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                      </div>
                      <div className='mb-2'>
                        <p><strong>Ссылка на ВКонтакте</strong></p>
                        <input value={tempVkLink} onChange={(e) => setTempVkLink(e.target.value)} className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                      </div>
                      <div className='flex flex-row gap-2 mb-2'>
                        <div className='flex-1'>
                          <p><strong>Дата рождения</strong></p>
                          <input value={tempBirthDate} onChange={(e) => setTempBirthDate(e.target.value)} type='date' className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                        </div>
                        <div className='flex-1'>
                          <p><strong>Пол</strong></p>
                          <select 
                            value={gender === 'F' ? 'Женский' : gender === 'M' ? 'Мужской' : gender} 
                            disabled
                            className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"
                          >
                            <option value="M">Мужской</option>
                            <option value="F">Женский</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className='flex gap-2 mt-4'>
                        <button className='flex-1 bg-brand text-white rounded-full p-2 text-sm' onClick={handleSaveProfile}>
                          Сохранить
                        </button>
                        <button className='flex-1 border border-brand text-brand rounded-full p-2 text-sm' onClick={handleCancelEdit}>
                          Отмена
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Вертикальная разделительная линия */}
            <div className="hidden lg:block w-px bg-brand mx-4 mt-8"></div>

            {/* Правая колонка - информация о команде и достижения */}
            <div className="lg:flex-1 mt-4">
  <div style={{ backgroundColor: '#08A6A5'}} className="h-px w-auto my-4 lg:hidden" />
  
  <div className='leaders mb-4 text-sm'>
    {/* Название команды с редактированием */}
    <div className='mb-2'>
      <p><strong>Название команды</strong></p>
      {!isEditingTeamNameOnly ? (
        <div className='flex gap-2 items-center'>
          <input 
            value={teamData.teamName}
            readOnly
            className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"
          />
          <button className='text-brand text-xs whitespace-nowrap hover:underline' onClick={() => { setIsEditingTeamNameOnly(true); setTempTeamName(teamData.teamName) }}>Редактировать</button>
        </div>
      ) : (
        <div className='flex gap-2 items-center'>
          <input 
            value={tempTeamName}
            onChange={(e) => setTempTeamName(e.target.value)}
            className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"
          />
          <button className='text-brand text-xs whitespace-nowrap hover:underline' onClick={async () => {
            try {
              if (!teamData.teamCode) return
              const newName = (tempTeamName || '').trim()
              if (newName.length === 0) return
              await teamsApi.rename(teamData.teamCode, newName)
              // Обновляем локально
              setTeamData({ ...teamData, teamName: newName })
              setIsEditingTeamNameOnly(false)
            } catch (e) {
              console.error('Failed to rename team:', e)
            }
          }}>Сохранить</button>
          <button className='text-xs hover:underline' onClick={() => setIsEditingTeamNameOnly(false)}>Отмена</button>
        </div>
      )}
    </div>

    <div className='flex flex-row gap-2 mb-2'>
      <div className='flex-1'>
        <p><strong>Трек</strong></p>
        <input value={teamData.track} readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-gray-200 h-[30px] flex items-center italic text-xs mt-1"/>
      </div>
      <div className='flex-1'>
        <p><strong>Код команды</strong></p>
        <input value={teamData.teamCode} readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1" />      
      </div>
    </div>
    
    <div className='mb-2'>
      <p><strong>Наставник</strong></p>
      <input value={teamData.mentor} readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1 capitalize"/>
    </div>
    
    <div className='mb-2'>
      <p><strong>Координатор</strong></p>
      <input value={teamData.coordinator} readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
    </div>
    
    <div className='mb-2'>
      <p><strong>Руководитель округа</strong></p>
      <input value={teamData.districtManager} readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
    </div>

    {/* Описание проекта (только просмотр) */}
    <div className='mb-2'>
      <p><strong>Описание проекта</strong></p>
      <input 
        value={teamData.projectDescription}
        readOnly
        className="w-full px-4 py-3 border border-brand rounded-full bg-gray-200 h-[30px] flex items-center italic text-xs mt-1"
      />
    </div>
    
    <p><strong>Команда проекта:</strong></p>
    <div className='w-full px-1 py-3 border border-brand rounded-2xl bg-white items-center mt-2'>
      {teamData.teamMembers.map((member: TeamMember) => (
        <div key={member.id} className='w-full flex flex-row items-center justify-between px-4 py-2'>
          <div className='flex flex-row items-center gap-4 flex-1'>
            <p className="text-brand text-xs min-w-[20px]">{member.number}</p>
            <p className="italic text-xs flex-1 capitalize">{member.fullName}</p>
          </div>
          {member.isCaptain && (
            <div className="w-3 h-3 lg:mr-10" title="Капитан команды"><img src='images/star.png' alt='star'></img></div>
          )}
        </div>
      ))}
      {teamData.teamMembers.length === 0 && (
        <p className="italic text-xs text-center py-2">Участники не найдены</p>
      )}
    </div>
  </div>
</div>
          </div>
        )}
        {sect==='myteam' && (
          <>
          {showWorkshopHomework ? (
            <div className="w-full lg:flex lg:justify-center">
              <div className="w-full">
                <WorkshopHomeworkLoad
                  teamCode={memberData?.team_code}
                  onSuccess={async () => {
                    // Обновляем список домашних заданий после успешной загрузки
                    if (memberData?.team_code) {
                      try {
                        const homeworksResult = await homeworksApi.getByTeamCode(memberData.team_code)
                        if (homeworksResult?.success && homeworksResult.data) {
                          setTeamHomeworks(homeworksResult.data)
                        }
                        
                        // Обновляем данные участника
                        const memberId = localStorage.getItem('member_id')
                        if (memberId) {
                          const memberResp = await membersApi.getById(Number(memberId))
                          const updatedMember = memberResp?.data
                          if (updatedMember) {
                            setMemberData(updatedMember)
                          }
                        }
                        
                        // Обновляем данные команды, чтобы получить обновленный трек
                        await loadTeamData(memberData.team_code)
                      } catch (error) {
                        console.error('Error reloading team homeworks:', error)
                      }
                    }
                    setShowWorkshopHomework(false); // Возвращаем к списку заданий
                  }}
                />
              </div>
            </div>
          ) : (
          <div className="lg:flex lg:gap-6">
            {/* Левая колонка - информация о команде */}
            {!currentHomeworkView && (
              <>
              <div className='baseinfo flex flex-col items-start mt-6 lg:flex-1'>
              <div className='flex flex-col lg:flex-row lg:items-start lg:gap-6 w-full'>
                {/* Аватар */}
                <div className='flex flex-row py-4 relative lg:flex-col lg:items-start'>
                  <img src='images/team.png' className='rounded-lg w-44 aspect-square'></img>
                  <img src='images/heading-icon.png' alt='logo' className='absolute w-48 right-5 lg:-right-0 lg:top-40'/>
                </div>
                
                {/* Информация о команде */}
                <div className='lg:flex-1 lg:w-full'>
                  <div className='w-full text-xs'>
                    <div className='mb-2'>
                      <p><strong>Название команды</strong></p>
                      {!isEditingTeamData ? (
                        <input 
                          value={teamData.teamName}
                          readOnly
                          className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"
                        />
                      ) : (
                        <input 
                          value={tempTeamNameForEdit}
                          onChange={(e) => setTempTeamNameForEdit(e.target.value)}
                          className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"
                        />
                      )}
                    </div>

                    <div className='flex flex-row gap-2 mb-2'>
                      <div className='flex-1'>
                        <p><strong>Трек</strong></p>
                        <input value={teamData.track} readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-gray-200 h-[30px] flex items-center italic text-xs mt-1"/>
                      </div>
                      <div className='flex-1'>
                        <p><strong>Код команды</strong></p>
                        <input value={teamData.teamCode} readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                      </div>
                    </div>
                    
                    <div className='mb-2'>
                      <p><strong>Наставник</strong></p>
                      <input value={teamData.mentor} readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1 capitalize"/>
                    </div>
                    
                    <div className='mb-2'>
                      <p><strong>Координатор</strong></p>
                      <input value={teamData.coordinator} readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                    </div>
                    
                    <div className='mb-2'>
                      <p><strong>Руководитель округа</strong></p>
                      <input value={teamData.districtManager} readOnly className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"/>
                    </div>

                    {/* Описание проекта */}
                    <div className='mb-2'>
                      <p><strong>Описание проекта</strong></p>
                      <input 
                        value={teamData.projectDescription}
                        readOnly
                        className="w-full px-4 py-3 border border-brand rounded-full bg-gray-200 h-[30px] flex items-center italic text-xs mt-1"
                      />
                    </div>

                    <div className='mb-2'>
                      <p><strong>Сайт проекта</strong></p>
                      <input 
                        value={teamData.projectSite}
                        readOnly
                        className="w-full px-4 py-3 border border-brand rounded-full bg-white h-[30px] flex items-center italic text-xs mt-1"
                      />
                    </div>
                    
                    <p><strong>Команда проекта:</strong></p>
                    <div className='w-full px-1 py-3 border border-brand rounded-2xl bg-white items-center mt-2'>
                      {teamData.teamMembers.map((member: TeamMember) => (
                        <div key={member.id} className='w-full flex flex-row items-center justify-between px-4 py-2'>
                          <div className='flex flex-row items-center gap-4 flex-1'>
                            <p className="text-brand text-xs min-w-[20px]">{member.number}</p>
                            <p className="italic text-xs flex-1 capitalize">{member.fullName}</p>
                          </div>
                          {member.isCaptain && (
                            <div className="w-3 h-3 lg:mr-10" title="Капитан команды"><img src='images/star.png' alt='star'></img></div>
                          )}
                        </div>
                      ))}
                      {teamData.teamMembers.length === 0 && (
                        <p className="italic text-xs text-center py-2">Участники не найдены</p>
                      )}
                    </div>
                    
                    <div className='w-full flex flex-col items-center mt-4'>
                      {!isEditingTeamData ? (
                        <button 
                          className='text-brand mt-2 hover:underline italic'
                          onClick={() => {
                            setIsEditingTeamData(true)
                            setTempTeamNameForEdit(teamData.teamName)
                          }}
                        >
                          Редактировать данные
                        </button>
                      ) : (
                        <div className='flex gap-2'>
                          <button 
                            className='bg-brand text-white rounded-full px-4 py-2 text-sm'
                            onClick={async () => {
                              try {
                                if (!teamData.teamCode) return
                                const newName = (tempTeamNameForEdit || '').trim()
                                if (newName.length === 0) return
                                await teamsApi.rename(teamData.teamCode, newName)
                                // Обновляем локально
                                setTeamData({ ...teamData, teamName: newName })
                                setIsEditingTeamData(false)
                              } catch (e) {
                                console.error('Failed to rename team:', e)
                              }
                            }}
                          >
                            Сохранить
                          </button>
                          <button 
                            className='border border-brand text-brand rounded-full px-4 py-2 text-sm'
                            onClick={() => setIsEditingTeamData(false)}
                          >
                            Отмена
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Вертикальная разделительная линия */}
            <div className="hidden lg:block w-px bg-brand mx-4 mt-8"></div>
            <div className="lg:flex-1 mt-4">
  
  <div className='leaders mb-4 text-sm'>
  <div style={{ backgroundColor: '#08A6A5'}} className="h-px w-auto lg:hidden" />
                <div className='mb-4'>
                  <div className='flex justify-between items-center my-3 lg:flex-col lg:items-start'>
                    <span className="text-sm font-bold lg:mb-2">Место в общем рейтинге:</span>
                    <span className="text-2xl font-bold text-brand lg:text-4xl">-</span>
                  </div>
                  <div style={{ backgroundColor: '#08A6A5'}} className="h-px w-auto my-3" />
                  <div className='flex justify-between items-center lg:flex-col lg:items-start'>
                    <span className="text-sm font-bold lg:mb-2">Место в рейтинге трека:</span>
                    <span className="text-2xl font-bold text-brand lg:text-4xl">-</span>
                  </div>
                </div>
  <div style={{ backgroundColor: '#08A6A5'}} className="h-px w-auto" />
  <div>
                  <p className="text-sm font-semibold my-4">Получено баллов:</p>
                  
                  <div className='space-y-3'>
                    {/* <div className='flex justify-between items-center border border-brand rounded-full p-2 px-4'>
                      <span className="text-sm text-black">Первое д/з</span>
                      <div className="flex items-center gap-2 ">
                        <button className="rounded flex items-center justify-center" onClick={() => handleHomeworkClick(1)}>
                          <img src="/images/locked.png" alt="lock" className="w-3" />
                        </button>
                        <span className="text-xs lg:text-sm text-brand italic">Заблокировано</span>
                      </div>
                    </div>
                    
                    <div className='flex justify-between items-center border border-brand rounded-full p-2 px-4'>
                      <span className="text-sm text-black">Второе д/з</span>
                      <div className="flex items-center gap-2">
                        <button className="rounded flex items-center justify-center" onClick={() => handleHomeworkClick(2)}>
                          <img src="/images/locked.png" alt="lock" className="w-3" />
                        </button>
                        <span className="text-xs lg:text-sm  text-brand italic">Заблокировано</span>
                      </div>
                    </div> */}
                    
                    {(() => {
                      const homeworkStatus = getHomeworkStatus(1)
                      const isUploaded = homeworkStatus.status === 'uploaded'
                      const isReviewed = homeworkStatus.status === 'reviewed'
                      const isWhiteBg = isUploaded || isReviewed
                      return (
                        <div className={`flex justify-between items-center border border-brand rounded-full p-2 px-4 ${isWhiteBg ? 'bg-white text-black' : 'bg-brand text-white'}`}>
                          <span className="text-sm">Первое д/з</span>
                          <div className="flex items-center gap-2">
                            {isUploaded ? (
                              <span className="text-xs lg:text-sm italic text-[#FF5500]">На проверке</span>
                            ) : isReviewed ? (
                              <span className="text-xs lg:text-sm text-brand">
                                {homeworkStatus.mark !== null && homeworkStatus.mark !== undefined ? (
                                  <>
                                    <span className="font-bold">{homeworkStatus.mark}</span> баллов
                                  </>
                                ) : (
                                  'Оценено'
                                )}
                              </span>
                            ) : (
                              <button className="rounded flex items-center justify-center italic text-xs lg:text-sm" onClick={() => handleHomeworkClick(1)}>
                                Загрузить
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })()}
                    
                    {(() => {
                      const workshopStatus = getWorkshopHomeworkStatus()
                      const isUploaded = workshopStatus.status === 'uploaded'
                      const isReviewed = workshopStatus.status === 'reviewed'
                      const isWhiteBg = isUploaded || isReviewed
                      return (
                        <div className={`flex justify-between items-center border border-brand rounded-full p-1.5 px-4 ${isWhiteBg ? 'bg-white text-black' : 'bg-brand text-white'}`}>
                          <span className={`text-sm ${isWhiteBg ? 'text-black' : 'text-white'}`}>Промежуточный ВШ</span>
                          <div className="flex items-center gap-2">
                            {isUploaded ? (
                              <span className="text-xs lg:text-sm italic text-[#FF5500]">На проверке</span>
                            ) : isReviewed ? (
                              <span className="text-xs lg:text-sm text-brand">
                                {workshopStatus.mark !== null && workshopStatus.mark !== undefined ? (
                                  <>
                                    <span className="font-bold">{workshopStatus.mark}</span> баллов
                                  </>
                                ) : (
                                  'Оценено'
                                )}
                              </span>
                            ) : (
                              <button 
                                onClick={handleWorkshopHomeworkClick}
                                className="rounded-xl bg-brand text-white italic text-xs lg:text-sm py-1"
                              >
                                Загрузить
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })()}
                    
                    <div className='flex justify-between items-center border border-brand rounded-full p-2 px-4'>
                      <span className="text-sm text-black">Второе д/з</span>
                      <div className="flex items-center gap-2">
                        <button className="rounded flex items-center justify-center">
                          <img src="/images/locked.png" alt="lock" className="w-3" />
                        </button>
                        <span className="text-xs lg:text-sm  text-brand italic">Заблокировано</span>
                      </div>
                    </div>
                    
                    <div className='flex justify-between items-center border border-brand rounded-full p-2 px-4'>
                      <span className="text-sm text-black">Третье д/з</span>
                      <div className="flex items-center gap-2">
                        <button className="rounded flex items-center justify-center">
                          <img src="/images/locked.png" alt="lock" className="w-3" />
                        </button>
                        <span className="text-xs lg:text-sm  text-brand italic">Заблокировано</span>
                      </div>
                    </div>
                    
                    <div className='flex justify-between items-center border border-brand rounded-full p-2 px-4'>
                      <span className="text-sm text-black">Четвертое д/з</span>
                      <div className="flex items-center gap-2">
                        <button className="rounded flex items-center justify-center">
                          <img src="/images/locked.png" alt="lock" className="w-3" />
                        </button>
                        <span className="text-xs lg:text-sm  text-brand italic">Заблокировано</span>
                      </div>
                    </div>
                    

                    
                    <div className='flex justify-between items-center border border-brand rounded-full p-2 px-4'>
                      <span className="text-sm text-black">Финальный ВШ</span>
                      <div className="flex items-center gap-2">
                        <button className="rounded flex items-center justify-center">
                          <img src="/images/locked.png" alt="lock" className="w-3" />
                        </button>
                        <span className="text-xs lg:text-sm  text-brand italic">Заблокировано</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
            </>
            )}
          
       {currentHomeworkView && ( <HomeworkLoad 
          title={mk_list[currentHomeworkView - 1]?.subtitle || `Домашнее задание ${currentHomeworkView - 2}`}
          preview={mk_list[currentHomeworkView - 1]?.description}
          desclink={mk_list[currentHomeworkView - 1]?.tz}
          desc={mk_list[currentHomeworkView - 1]?.fulldesc}
          prezlink={mk_list[currentHomeworkView - 1]?.pres}
          templink={mk_list[currentHomeworkView - 1]?.template}
          teamCode={memberData?.team_code}
          homeworkNumber={getHomeworkNumberByMkIndex(currentHomeworkView - 1) || undefined}
          onSuccess={async () => {
            // Обновляем список домашних заданий после успешной загрузки
            if (memberData?.team_code) {
              try {
                const homeworksResult = await homeworksApi.getByTeamCode(memberData.team_code)
                if (homeworksResult?.success && homeworksResult.data) {
                  setTeamHomeworks(homeworksResult.data)
                  
                  // Обновляем статус для текущего мастер-класса
                  if (selectedMk) {
                    const normalizedSubtitle = (selectedMk.subtitle || '').trim();
                    const homework = homeworksResult.data.find(hw => {
                      const normalizedHwName = (hw.hw_name || '').trim();
                      return normalizedHwName === normalizedSubtitle;
                    });
                    
                    if (homework) {
                      if (homework.status === 'uploaded') {
                        setMkHomeworkStatus({ status: 'uploaded' });
                      } else if (homework.status === 'reviewed') {
                        setMkHomeworkStatus({ status: 'reviewed', mark: homework.mark });
                      } else {
                        setMkHomeworkStatus({ status: null });
                      }
                    } else {
                      setMkHomeworkStatus({ status: null });
                    }
                  }
                }
              } catch (error) {
                console.error('Error reloading team homeworks:', error)
              }
            }
            setCurrentHomeworkView(null); // Возвращаем к списку заданий
          }}
        />)}
        
          </div>
          )}
          </>
        )}
        {sect==='calendar' && (
          <CalendarPage />
        )}
        {sect==='team' && (
          <TeamPage />
        )}
        {sect==='courses' && (

          
          <section className="space-y-3">
          {selectedMk && !showHomework && (
                 <div className="py-4">
                 <div className="">
                   {/* Кнопка назад */}
                   <button 
                     onClick={handleBackToMks}
                     className="flex items-center text-brand mb-2 hover:underline"
                   >
                     <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                     </svg>
                     Назад к материалам
                   </button>
         
                   {/* Детали мероприятия */}
                   <div className="p-2">
                     <h2 className="text-lg font-bold text-brand mb-4 normal-case text-center">{selectedMk.title}</h2>

                     <div className='flex w-full lg:px-8 items-center justify-center text-left'>
                       <img src={selectedMk.image} className="rounded-lg w-full lg:w-96 mb-6"></img>
                     </div>

                     <a href={getDownloadLink(selectedMk.pres)} download className='text-brand italic hover:underline text-sm block'>Скачать презентацию</a>
                     {selectedMk.criteria && (
                       <a href={getDownloadLink(selectedMk.criteria)} download className='text-brand italic hover:underline text-sm block'>Скачать критерии для выполнения д/з</a>
                     )}
                     {selectedMk.tz && (
                       <a href={getDownloadLink(selectedMk.tz)} download className='text-brand italic hover:underline text-sm block'>Скачать описание задания</a>
                     )}
          
         
                    <div style={{ backgroundColor: '#08A6A5'}} className="h-px w-auto my-4" />

                    {/* Отображение статусов для структуры */}
                    {structureTeamsForMk.length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Статусы выполнения командами:</h3>
                        <div className="space-y-2">
                          {structureTeamsForMk.map((team) => {
                            const teamHomeworks = teamsHomeworksForMk[team.code] || [];
                            const normalizedSubtitle = (selectedMk?.subtitle || '').trim();
                            const homework = teamHomeworks.find(hw => {
                              const normalizedHwName = (hw.hw_name || '').trim();
                              return normalizedHwName === normalizedSubtitle;
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
                    
                    <div className="flex w-full flex-col">
                      <div className='w-full text-left'>
                        <p className="text-md font-semibold text-black mb-2">{selectedMk.tz ? 'Описание домашнего задания' : 'Описание'}</p>
                        <div className='rounded-lg border border-brand p-2'>
                          <p className='text-xs'>{selectedMk.description}</p>
                        </div>
                    </div>
                    
                    {/* Дедлайн */}
                    {memberData?.team_code && selectedMk.tz && (() => {
                      const mkIndex = mk_list.findIndex(mk => mk.title === selectedMk.title && mk.subtitle === selectedMk.subtitle);
                      const hwNumber = getHomeworkNumberByMkIndex(mkIndex);
                      const deadline = hwNumber ? getDeadline(hwNumber) : null;
                      return deadline ? (
                        <div className="mb-4 p-3 border border-brand rounded-lg bg-gray-50">
                          <p className="text-sm font-semibold text-black mb-1">
                            ДЗ {hwNumber}
                          </p>
                          <p className="text-xs text-gray-700">
                            закрывается {deadline}
                          </p>
                        </div>
                      ) : null;
                    })()}
                    
                    {/* Отображение статуса или кнопки для участника */}
                    {memberData?.team_code && selectedMk.tz && (
                      <div className="flex w-full justify-center mt-4">
                        {mkHomeworkStatus !== null && (mkHomeworkStatus.status === 'uploaded' || mkHomeworkStatus.status === 'reviewed') ? (
                          <div className={`flex justify-between items-center border border-brand rounded-full p-2 px-4 w-full ${
                            mkHomeworkStatus.status === 'uploaded' || mkHomeworkStatus.status === 'reviewed' 
                              ? 'bg-white text-black' 
                              : 'bg-brand text-white'
                          }`}>
                            <span className="text-sm">Статус выполнения</span>
                            <div className="flex items-center gap-2">
                              {mkHomeworkStatus.status === 'uploaded' ? (
                                <span className="text-xs lg:text-sm italic text-[#FF5500]">На проверке</span>
                              ) : mkHomeworkStatus.status === 'reviewed' ? (
                                <span className="text-xs lg:text-sm text-brand">
                                  <span className="font-bold">{mkHomeworkStatus.mark}</span> баллов
                                </span>
                              ) : (
                                <span className="text-xs lg:text-sm">Не выполнено</span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <button 
                            onClick={handleButtonClick}
                            className='rounded-xl bg-brand text-white font-semibold p-3 text-xs w-2/3 lg:w-1/3 lg:text-lg'
                          >
                            Перейти к выполнению
                          </button>
                        )}
                      </div>
                    )}
                    </div>

                   </div>
                 </div>
               </div>
          )}
          
          { !selectedMk && !showHomework && !showWorkshopHomework && (<div>
          <h3 className="text-left normal-case text-brand font-extrabold text-[18px] uppercase py-3">Мастер-классы</h3>
    
          <div className="relative">
            <div 
              ref={scrollContainerRefmk}
              className="flex overflow-x-auto space-x-3 hide-scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] 
                          [-webkit-overflow-scrolling:touch] pb-4 snap-x snap-mandatory"
              onScroll={handleScrollmk}
            >
              {mk_list.map((mk, index) => (
                <div key={index} className="snap-start cursor-pointer" onClick={() => handleMkClick(mk)}>
                  <Card 
                    title={mk.title}
                    subtitle={mk.subtitle}
                    image={mk.image}
                  />
                </div>
              ))}
            </div>
            
            {/* Точки прогресса */}
            <div className="flex justify-center space-x-2 my-2 lg:hidden">
              {mk_list.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => scrollToDotmk(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === activeDotmk ? 'bg-brand scale-125' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
  
          <h3 className="text-left normal-case text-brand font-extrabold text-[18px] uppercase pb-3">Примеры проектов</h3>
          <div className="relative">
            <div 
              ref={scrollContainerRefpr}
              className="flex overflow-x-auto space-x-3 hide-scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] 
                          [-webkit-overflow-scrolling:touch] snap-x snap-mandatory"
              onScroll={handleScrollpr}
            >
              {project_list.map((project, index) => (
                <div key={index} className="snap-start">
                  <Card 
                    title={project.title}
                    subtitle={project.subtitle}
                    image={project.image}
                  />
                </div>
              ))}
            </div>
            
            {/* Точки прогресса */}
            <div className="flex justify-center space-x-2 my-2">
              {project_list.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => scrollToDotpr(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === activeDotpr ? 'bg-brand scale-125' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
  
          <h3 className="text-left normal-case text-brand font-extrabold text-[18px] uppercase pb-3">Подкаст "Давай по делу"</h3>
          <div className="relative">
            <div 
              ref={scrollContainerRefpod}
              className="flex overflow-x-auto space-x-3 hide-scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] 
                          [-webkit-overflow-scrolling:touch] snap-x snap-mandatory"
              onScroll={handleScrollpod}
            >
              {podcast_list.map((podcast, index) => (
                <div key={index} className="snap-start">
                  <Card 
                    title={podcast.title}
                    image={podcast.image}
                    link={podcast.link}
                  />
                </div>
              ))}
            </div>
            
            {/* Точки прогресса */}
            <div className="flex justify-center space-x-2 my-2 lg:hidden">
              {podcast_list.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => scrollToDotpod(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === activeDotpod ? 'bg-brand scale-125' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>)}
        {showHomework && (
          <HomeworkLoad 
          title={selectedMk?.subtitle}
          preview={selectedMk?.description}
          desclink={selectedMk?.tz}
          desc={selectedMk?.fulldesc}
          prezlink={selectedMk?.pres}
          templink={selectedMk?.template}
          teamCode={memberData?.team_code}
          homeworkNumber={(() => {
            const mkIndex = mk_list.findIndex(mk => mk.title === selectedMk?.title && mk.subtitle === selectedMk?.subtitle);
            return getHomeworkNumberByMkIndex(mkIndex) || undefined;
          })()}
          onSuccess={async () => {
            // Обновляем список домашних заданий после успешной загрузки
            if (memberData?.team_code) {
              try {
                const homeworksResult = await homeworksApi.getByTeamCode(memberData.team_code)
                if (homeworksResult?.success && homeworksResult.data) {
                  setTeamHomeworks(homeworksResult.data)
                }
              } catch (error) {
                console.error('Error reloading team homeworks:', error)
              }
            }
            setShowHomework(false); // ⬅️ СКРЫВАЕМ КОМПОНЕНТ ЗАГРУЗКИ
            setSelectedMk(null);    // ⬅️ СБРАСЫВАЕМ ВЫБРАННЫЙ МК
          }}
        />
        )}
        </section>
        )}
      </div>
    </section>
  )
}

export default ProfilePageMember;