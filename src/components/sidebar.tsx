import Link from "next/link";
import Image from "next/image";
import { DotSeperator } from "./dot-seperator";
import { Navigation } from "./Navigation";
import { WorkSpaceSwitcher } from "./WorkSpaceSwitcher";


export const Sidebar = () => {
    return (
        <aside className=" h-full bg-neutral-100 p-4 w-full">
            <Link href="/">
                <Image src="/logo.svg" alt ="logo" width={148} height={54} />
            </Link>
            <DotSeperator className="my-4" />
            <WorkSpaceSwitcher />
            <Navigation />
        </aside>
    );
};

