export default function AudioPreview ({url}: {url:string}){

    return(
        <div>
            <audio  controls>
                <source src={url} type="audio/webm" />
            </audio>
        </div>
    )
}