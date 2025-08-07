type LoaderProps = {
    size?: 'small' | 'medium' | 'large'
    height?: 'screen' | 'full' | '100vh' | '100%';
}

type LoaderWrapperProps = {
    children: React.ReactNode
    isLoading: boolean
} & LoaderProps;

export const Loader = ({ size = 'medium', height = 'screen' }: LoaderProps) => {
    return (
        <div className={`min-h-${height} bg-background flex items-center justify-center`}>
            <div className={`text-center space-y-4 ${size === 'small' ? 'space-y-2' : size === 'medium' ? 'space-y-4' : 'space-y-6'}`}>
                <div className={`w-${size === 'small' ? '4' : size === 'medium' ? '8' : '12'} h-${size === 'small' ? '4' : size === 'medium' ? '8' : '12'} border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto`}></div>
            </div>
        </div>
    )
}

export const LoaderWrapper = ({ children, isLoading, size = 'medium', height = 'screen' }: LoaderWrapperProps) => {
    if (isLoading) {
        return <Loader size={size} height={height} />
    }
    return <>{children}</>;
}

