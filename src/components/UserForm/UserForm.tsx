export default function UserForm({children}: {
    children: React.ReactNode
}){

    return(
        <div className="flex justify-center items-center h-screen bg-gray-100">
            {children}
        </div>
    )
}