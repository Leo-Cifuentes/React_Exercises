
type ButtonProps = {
    buttonText: string, onFetch: () => void;
}

const Button = ({ buttonText, onFetch }: ButtonProps) => {

    return (
        <>
            <button
                type="button"
                onClick={onFetch}
                className="m-3 px-8 py-3 bg-blue-600 hover:bg-indigo-700 text-white rounded-full cursor-pointer">
                {buttonText}
            </button>
        </>
    )
}

export default Button;