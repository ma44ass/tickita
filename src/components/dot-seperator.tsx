import {cn} from '@/lib/utils'

interface DotSeperatorProps{
    className?: string;
    color?: string;
    height?: string;
    dotSize?: string;
    gapsize?: string;
    direction?: "horizontal" | "vertical";
}

export const DotSeperator = ({
    className,
    color="#83BEF7",
    height="2px",
    dotSize="2px",
    gapsize="6px",
    direction ="horizontal"
}:DotSeperatorProps) => {
    const isHorizontal =direction === "horizontal";

    return (
        <div className={cn(
            isHorizontal ? "w-full flex items-center" :"h-full flex flex-col items-center",
            className,
        )}>
            <div
            className={isHorizontal ? "flex-grow" : "flex-grow-0"}
            style={{
                width: isHorizontal ? "100%" : height,
                height: isHorizontal ? height : "100%",
                backgroundImage:`radial-gradient(circle, ${color} 25%, transparent 25%)`,
                backgroundSize: isHorizontal
                ? `${parseInt(dotSize) + parseInt(gapsize)}px ${height}`
                :`${height} ${parseInt(dotSize) + parseFloat(gapsize)}px`,
                backgroundRepeat: isHorizontal? "repeat-x" : "repeat-y",
                backgroundPosition: "center",
            }}
            />

        </div>
    )

};