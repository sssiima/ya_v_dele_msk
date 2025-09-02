const Card = ({ title }: { title?: string }) => (
  <div className="relative rounded-xl bg-gray-200 h-32 overflow-hidden">
    {title && (
      <div className="absolute bottom-2 left-0 right-0">
        <div className="bg-gradient-to-r from-white via-white to-transparent h-4 w-full" />
        
        <div className="absolute bottom-0 left-0 right-0 px-2 py-0.5 h-4 flex items-center">
          <div className="text-left text-brand font-bold text-xs pl-2">
            {title}
          </div>
        </div>
      </div>
    )}
  </div>
)

const ProjectsShowcase = () => {
  return (
    <section className="space-y-3">
      <div
        style={{ backgroundColor: '#08A6A5'}}
        className="h-px w-auto"
      />
      <h3 className="text-center text-brand font-extrabold text-[18px] uppercase pb-3">витрина проектов</h3>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Card title="Название проекта" />
        </div>
        <div className="space-y-1">
          <Card title="Название проекта" />
        </div>
        <div className="space-y-1">
          <Card title="Название проекта" />
        </div>
        <div className="space-y-1">
          <Card title="Название проекта" />
        </div>
      </div>
      
      <div className="text-center text-sm text-brand font-regular">другие проекты</div>
    </section>
  )
}

export default ProjectsShowcase