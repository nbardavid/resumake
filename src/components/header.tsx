export function Header(){
    return (
        <div className="flex px-10 w-full h-15 place-content-between items-center border-b-4">
            <h1 className="text-3xl font-bold">Resumake</h1>
            <div className="flex gap-1">
                <img src="/github-mark.svg" className="w-5 h-5" />
                <a href="https://github.com/nbardavid/resume-maker" className="hover-lift text-l"> GitHub </a>
            </div>
        </div>
    )
}
