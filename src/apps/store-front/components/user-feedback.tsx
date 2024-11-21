import { useState } from 'react';

const RATINGS_TEXT: string[] = [
    '',
    'Very Dissatisfied',
    'Dissatisfied',
    'Neutral',
    'Satisfied',
    'Extremely Satisfied'
];

type UserFeedbackProps = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

const UserFeedback:React.FC<UserFeedbackProps> = ({ isOpen, onOpenChange }) => {
    const [ rating, setRating ] = useState<number>(0);
    const [ submitted, setSubmitted ] = useState(false);

    const handleRatingChange = (value: number) => {
        setRating(value);
        setSubmitted(true);
    };

    const handleCloseModal = () => {
        onOpenChange(false);
        setSubmitted(false); // resets submitted state when modal is closed
        setRating(0); // resets user selected rating to 0 when modal is closed
    };

    const handleReturnHome = () => {
        handleCloseModal();
        console.log("Take me home to the place where I belong, WEST VIRGINIA, MOUNTAIN MAMA, TAKE ME HOME, COUNTRY ROADS");
    };

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 z-40 flex justify-center items-center bg-black bg-opacity-40">
                    <dialog id="my_modal_3" className="relative z-50 overflow-y-auto rounded-lg px-5 py-2 bg-white" open={isOpen}>
                        <div className="text-center p-4 max-w-lg">
                            <h1 className="text-2xl font-bold mt-4 mb-9">How would you rate your experience?</h1>
                            <button 
                                className="btn btn-sm btn-circle btn-ghost absolute right-4 top-2" 
                                onClick={handleCloseModal}>
                                ✕
                            </button>
                            {submitted ? (
                                <p className="text-lg font-normal mb-8">Thank you for your feedback!</p>
                            ) : (
                                <div className="flex justify-between">
                                    {[1, 2, 3, 4, 5].map((value) => (
                                        <div key={value} className="flex flex-col items-center">
                                            <button
                                                className={`w-12 h-12 rounded-full text-lg font-bold border border-black hover:bg-gray-300 focus:outline-none focus:border-yellow-500 bg-gray-100 mb-4 ${
                                                    rating === value ? 'bg-red-500 text-white' : '' }`}
                                                onClick={() => handleRatingChange(value)}
                                                >
                                                {value}
                                            </button>
                                            <p 
                                                className="mt-1 text-center" 
                                                style={{ fontSize: '1rem', height: '50px', display: 'flex', width: '90px', alignItems: 'center', justifyContent: 'center' }}
                                                >
                                                {RATINGS_TEXT[value]}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <button 
                                className="bg-white-100 border-black border hover:bg-gray-300 text-black py-2 px-4 rounded-lg text-lg font-bold mt-4 mb-3" 
                                onClick={handleReturnHome}>
                                Home
                            </button>
                        </div>
                    </dialog>
                </div>
            )}
        </>
    );
};

export default UserFeedback;
