import data from "../data/portfolio.json";
import Image from "next/image";
import { resolveImagePath } from "../utils/image";

const { personalInfo } = data;

export default function Header() {
    return (
        <header className="mb-12 pt-12 flex items-center gap-8">
            {personalInfo.profileImage && (
                <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden rounded-full">
                    <Image
                        src={resolveImagePath(personalInfo.profileImage)}
                        alt={personalInfo.name}
                        fill
                        className="object-cover"
                    />
                </div>
            )}
            <div>
                <h1 className="text-xl font-semibold mb-4 text-black">{personalInfo.name}</h1>
                <p className="text-gray-500 max-w-2xl leading-relaxed text-sm">
                    {personalInfo.bio}
                </p>
            </div>
        </header>
    );
}
