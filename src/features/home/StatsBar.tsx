const StatsBar = () => {
  return (
    <section className="py-1">
      <div
        style={{ backgroundColor: '#08A6A5' }}
        className="h-px w-auto"
      />
      
      <div className="flex items-center justify-between py-4">
        <h3 className="text-brand text-[9px] text-center  normal-case">2800 охват студентов</h3>
        {/* <img src="images/line1.png" alt="divider" className="mx-2 w-10 h-6 object-contain" /> */}
        <h3 className="text-brand text-[9px] text-center  normal-case">74 ВУЗа</h3>
        {/* <img src="images/line2.png" alt="divider" className="mx-2 w-10 h-6 object-contain" /> */}
        <h3 className="text-brand text-[9px] text-center  normal-case">1650 наставников</h3>
      </div>
      <img src='images/stats.png' alt='video' className="rounded-xl bg-gray-200" />
      <div className="flex items-center justify-between pt-4">
        <h3 className="text-brand text-[9px] text-center normal-case">12600 выпускников</h3>
        {/* <img src="images/line1.png" alt="divider" className="mx-2 w-10 h-6 object-contain" /> */}
        <h3 className="text-brand text-[9px] text-center normal-case">460 экспертов</h3>
        {/* <img src="images/line2.png" alt="divider" className="mx-2 w-10 h-6 object-contain" /> */}
        <h3 className="text-brand text-[9px] text-center normal-case">3200 бизнес-идеи</h3>
      </div>
    </section>
  )
}

export default StatsBar