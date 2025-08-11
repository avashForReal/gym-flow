import type { ClassNameValue } from "tailwind-merge";

type ExerciseGifProps = {
    gifUrl: string;
    name: string;
    twClassName: ClassNameValue
}

const ExerciseGif = ({
    gifUrl,
    name,
    twClassName
}: ExerciseGifProps) => {
    return (
        <div className={`${twClassName} w-16 h-16 bg-muted rounded-lg overflow-hidden`}>
            <img
                src={gifUrl}
                alt={`${name} demonstration`}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                        parent.innerHTML = `
                                            <div class="flex items-center justify-center h-full">
                                                <svg class="h-6 w-6 text-muted-foreground opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                                                    <circle cx="9" cy="9" r="2"/>
                                                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                                                </svg>
                                            </div>
                                        `;
                    }
                }}
            />
        </div>
    )
}

export default ExerciseGif