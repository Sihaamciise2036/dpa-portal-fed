import { cn } from "../../lib/utils";
export default function Divider({ className, dividerText }) {
    return (
        <div className={cn("my-4", dividerText ? "flex items-center gap-4" : "border-b border-light-850/20", className)}>
            {dividerText ? (
                <>
                    <span className="border-b border-border block flex-grow align-middle"></span>
                    {dividerText}
                    <span className="border-b border-border block flex-grow align-middle"></span>
                </>
            ) : (
                <></>
            )}
        </div>
    );
}
