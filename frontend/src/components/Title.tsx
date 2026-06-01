function Title({text1, text2}: {text1: string, text2: string}){
  return(
    <div className="inline-flex gap-3 items-center mb-4">
      <h2 className="text-2xl sm:text-3xl font-light text-gray-500 tracking-wide">
        {text1}{" "}
        <span className="font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {text2}
        </span>
      </h2>
      <span className="w-12 sm:w-16 h-[3px] rounded-full bg-gradient-to-r from-primary to-secondary opacity-80"></span>
    </div>
  )
}
export default Title;