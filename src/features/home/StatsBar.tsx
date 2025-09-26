const StatsBar = () => {
  return (
    <section className="py-1">
      <div
        style={{ backgroundColor: '#08A6A5' }}
        className="h-px w-auto"
      />
      
      <div className="flex items-center justify-between py-4">
        <h3 className="text-brand text-[9px] text-center flex-1 normal-case">3200 участников</h3>
        {/* <img src="images/line1.png" alt="divider" className="mx-2 w-10 h-6 object-contain" /> */}
        <h3 className="text-brand text-[9px] text-center flex-1 normal-case">23 ВУЗа</h3>
        {/* <img src="images/line2.png" alt="divider" className="mx-2 w-10 h-6 object-contain" /> */}
        <h3 className="text-brand text-[9px] text-center flex-1 normal-case">43 эксперта</h3>
      </div>
      <div className="rounded-xl bg-gray-200 h-36" />
      <div className="flex items-center justify-between pt-4">
        <h3 className="text-brand text-[9px] text-center flex-1 normal-case">10 партнеров</h3>
        {/* <img src="images/line1.png" alt="divider" className="mx-2 w-10 h-6 object-contain" /> */}
        <h3 className="text-brand text-[9px] text-center flex-1 normal-case">38 менторов</h3>
        {/* <img src="images/line2.png" alt="divider" className="mx-2 w-10 h-6 object-contain" /> */}
        <h3 className="text-brand text-[9px] text-center flex-1 normal-case">753 проекта</h3>
      </div>
    </section>
  )
}

export default StatsBar