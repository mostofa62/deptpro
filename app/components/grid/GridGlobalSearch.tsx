interface GridGlobalInterface{
    filterInput:string;
    handleFilterChange:(e:any)=>void;
    applyFilter:()=>void;
    placeHolderText:string;
    searchButtonText:string;
}

const GridGlobalSearch = ({
    filterInput,
    handleFilterChange,
    applyFilter,
    placeHolderText,
    searchButtonText
}:GridGlobalInterface)=>{
    
    
    return(

        <div className="relative">


                        <div className="flex flex-row h-[45px]">

                          <div>
                                  <span className="absolute top-[50%] left-2 -translate-y-1/2">
                                        <svg
                                      className="fill-[#4F4F4F]"
                                      width="15"
                                      height="15"
                                      viewBox="0 0 18 18"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M9.16666 3.33332C5.945 3.33332 3.33332 5.945 3.33332 9.16666C3.33332 12.3883 5.945 15 9.16666 15C12.3883 15 15 12.3883 15 9.16666C15 5.945 12.3883 3.33332 9.16666 3.33332ZM1.66666 9.16666C1.66666 5.02452 5.02452 1.66666 9.16666 1.66666C13.3088 1.66666 16.6667 5.02452 16.6667 9.16666C16.6667 13.3088 13.3088 16.6667 9.16666 16.6667C5.02452 16.6667 1.66666 13.3088 1.66666 9.16666Z"
                                        fill=""
                                      />
                                      <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M13.2857 13.2857C13.6112 12.9603 14.1388 12.9603 14.4642 13.2857L18.0892 16.9107C18.4147 17.2362 18.4147 17.7638 18.0892 18.0892C17.7638 18.4147 17.2362 18.4147 16.9107 18.0892L13.2857 14.4642C12.9603 14.1388 12.9603 13.6112 13.2857 13.2857Z"
                                        fill=""
                                      />
                                    </svg>
                                    </span>
                                    {/*
                                    <input

                                    className="w-full rounded-sm border border-stroke bg-transparent py-1 pl-6.5 pr-10 outline-none focus:border-[#0a4a82] focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-[#0a4a82]"
                                      
                                      value={globalFilter}
                                      onChange={e => setGlobalFilter(e.target.value)}
                                                                            
                                      placeholder="Search..."
                                    />
                                    */}
                                    <input

                                    className="w-full text-[18px] h-[45px] text-[#4F4F4F] rounded-sm border border-[#DFDFDF] bg-transparent py-1 pl-7.5 pr-6.5 outline-none focus:border-[#0a4a82] focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-[#0a4a82]"
                                      
                                                                            
                                      value={filterInput}
                                      onChange={handleFilterChange}
                                      placeholder={`${placeHolderText}`}
                                    />
                            </div>
                            <div className="ml-[-2px]">

                                    <button className="bg-[#43ACD6] w-[92px] text-white py-1 px-2 rounded-tr rounded-br h-[45px] text-[18px] font-medium" onClick={applyFilter}>
                                      {searchButtonText}
                                    </button>
                            </div>

                        </div>                

                        </div>
    )
}

export default GridGlobalSearch;