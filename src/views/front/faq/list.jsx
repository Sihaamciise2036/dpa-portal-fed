import React, { useState, useEffect } from "react";
import MainContentPart from "@/layout/front/MainContentPart";
import CustomCard from "@/components/common/CustomCard";
import { ChevronDown } from "lucide-react";
import { getFAQService } from "@/services/user/FaqServices";
import IsLoadingNotFound from "@/components/ui/tables/IsLoadingNotFound";
import { useSelector, useDispatch } from "react-redux";
import validationErrors from "@/lib/validationErrors";
import { cn } from "@/lib/utils";

const FAQList = () => {
    const dispatch = useDispatch();
    const [dataSource, setDataSource] = useState([]);
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [dataFilter, setDataFilter] = useState({
        search: "",
        page: 1,
        limit: 10,
        extra_filter: {},
    });

    useEffect(() => {
        fetchFAQs();
    }, []);

    const fetchFAQs = () => {
        setIsLoading(true);
        dispatch(getFAQService(dataFilter))
            .then((res) => {
                setDataSource(res?.data?.data?.data);
                setIsLoading(false);
            })
            .catch(({ message, errorData, statusCode }) => {
                validationErrors(errorData, message);
                setIsLoading(false);
            });
    };

    const toggleExpand = (index) => {
        setExpandedIndex((prev) => (prev === index ? null : index));
    };

    return (
        <MainContentPart>
            <CustomCard className="p-6 !border-t-4 !border-t-green">
                <div className="bg-white rounded-xl shadow-md px-6 py-4">
                    <h2 className="text-xl font-semibold text-primary mb-4">Frequently Asked Questions</h2>
                </div>

                <div className="card-body space-y-4 mt-4">
                    {isLoading ? (
                        <IsLoadingNotFound isLoading={true} />
                    ) : dataSource.length === 0 ? (
                        <IsLoadingNotFound isLoading={false} />
                    ) : (
                        dataSource.map((faq, index) => (
                            <div key={faq._id} className="border rounded-lg overflow-hidden shadow-sm">
                                <button
                                    onClick={() => toggleExpand(index)}
                                    className="flex items-center justify-between w-full px-6 py-4 bg-light-100 text-primary font-medium hover:bg-primary/10 transition-all">
                                    <span className="text-left">{faq.question}</span>
                                    <ChevronDown className={cn("transition-transform duration-300", expandedIndex === index && "rotate-180")} />
                                </button>
                                {expandedIndex === index && <div className="px-6 py-4 text-sm text-dark-900 bg-light-50 border-t">{faq.answer}</div>}
                            </div>
                        ))
                    )}
                </div>
            </CustomCard>
        </MainContentPart>
    );
};

export default FAQList;
