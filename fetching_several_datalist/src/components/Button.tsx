
type ButtonProps = {
    buttonText: string, onClick?: () => void;
}

const Button = ({ buttonText, onClick }: ButtonProps) => {

    return (
        <>
            <button
                type="button"
                onClick={onClick}                
                className="m-3 px-8 py-3 bg-blue-600 hover:bg-indigo-700 text-white rounded-full cursor-pointer">
                {buttonText}
            </button>
        </>
    )
}

export default Button;