export default function ErrorBox({message}: {
    message: string
}){
    return(
        <div className="bg-red-400 border-red-700 border-2 text-red-900 text-sm rounded p-2 my-2 ">
            <p>{message}</p>
        </div>
    )
}