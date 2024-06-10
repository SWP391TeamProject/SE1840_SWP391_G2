import "../components/loading.css";

export default function LoadingScreen() {
    return (
        <div className="flex items-center justify-center h-screen">
            <div>
                <div className="loader m-auto"></div>
                <h1 className="mt-5">Server đang bị hack, vui lòng chờ chút!</h1>
            </div>
        </div>
    )
}