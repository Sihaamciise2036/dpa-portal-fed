import DataTableWrapServerSide from "@/components/ui/tables/DataTableWrapServerSide";
import Moment from "moment";

const RepliedDataList = ({ isLoading, tableColumn, dataSource, totalRecord, dataFilter, onChangePage, handleFromData }) => {
    return (
        <DataTableWrapServerSide tableColumnList={tableColumn} totalDataCount={totalRecord} initialPage={dataFilter?.page} onChangePage={onChangePage} per_page={dataFilter?.limit}>
            <ul className="grid grid-cols-1 max-h-[calc(100vh-360px)] overflow-y-auto">
                {dataSource.map((data, key) => (
                    <li
                        key={key}
                        onClick={() => handleFromData(data?.modelData)}
                        className={`border-b border-light-850/20 py-2.5 px-2 flex items-start gap-2 [&.active]:text-primary [&.active]:bg-primary/10 [&.active]:border-s-primary hover:text-primary hover:bg-primary/10 border-s-2 border-s-transparent hover:border-s-primary transition-all duration-500`}
                        // add active class here
                    >
                        <div className="size-9 flex-shrink-0 bg-gray-300 rounded-full chat-user-icon" />
                        <div className="chat-user-text flex-grow">
                            <h4 className="flex items-start justify-between gap-2">
                                <span className="block line-clamp-1">{data?.modelData?.mandatedPerson?.idNumber}</span>{" "}
                                <span className="text-xs text-light-850 font-normal">{Moment("2025-04-05T11:35:06.215Z").fromNow()}</span>
                            </h4>
                            <p className="text-sm text-light-850 line-clamp-1">{data?.lastMessage?.message?.slice(0, 30)}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </DataTableWrapServerSide>
    );
};

export default RepliedDataList;
