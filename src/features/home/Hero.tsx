import Header from "@/components/Header"

const Hero = () => {
  return (
    <section className="card p-0 overflow-hidden">

      <div className="relative z-10">
        <Header />
      </div>
      <div className="px-4 pb-8 flex justify-center">
        <img
          src="/images/heading-icon.png"
          alt="Элемент перед заголовком"
          className="-rotate-[7deg] w-100"
        />
      </div>
      <div className="px-2 pb-0">
        <h2 className="text-center font-heading leading-tight" style={{ fontSize: '16px'  }}>
          Всероссийская программа развития молодёжного предпринимательства
        </h2>
      </div>
    </section>
  )
}

export default Hero
