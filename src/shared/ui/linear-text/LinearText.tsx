type LinearTextProps = {
    text: string;
    className?: string;
}

export function LinearText({ text, className }: LinearTextProps) {
    return (
        <p className={`bg-linear-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent ${className || ''}`}>
            {text}
        </p>
    )
}